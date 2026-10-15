import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { rentalSchema } from "@/lib/rental-validation";

import { RentalForm } from "@/components/rental-form";
const language = vi.hoisted(() => ({ locale: "en" as "en" | "vi" }));
vi.mock("@/components/language", () => ({
  useLanguage: () => ({
    locale: language.locale,
    setLocale: vi.fn(),
    t: (vi: string, en: string) => (language.locale === "vi" ? vi : en),
  }),
}));
beforeEach(() => {
  language.locale = "en";
  window.history.replaceState({}, "", "/rent?vehicle=pink");
});
afterEach(() => {
  vi.unstubAllGlobals();
});
function fillForm() {
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Alex Nguyen" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "alex@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Phone (with country code)"), {
    target: { value: "+44 7700 900123" },
  });
  fireEvent.change(screen.getByLabelText("Rental package"), {target:{value:"day"}});
  fireEvent.change(screen.getByLabelText("Pickup city"), {
    target: { value: "hcm" },
  });
  fireEvent.change(screen.getByLabelText("Start date"), {
    target: { value: "2027-02-10" },
  });
  fireEvent.change(screen.getByLabelText("Return date"), {
    target: { value: "2027-02-12" },
  });
  fireEvent.click(screen.getByRole("checkbox"));
}
it("posts the enquiry contract and shows a saved reference, not a booking confirmation", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({
      status: 201,
      json: async () => ({ id: "REQ-123", status: "new" }),
    });
  vi.stubGlobal("fetch", fetchMock);
  const storage = vi.spyOn(Storage.prototype, "setItem");
  render(<RentalForm />);
  expect(screen.getByLabelText("Vehicle")).toHaveValue("pink");
  expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await screen.findByText("REQ-123");
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/rentals",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.any(String),
    }),
  );
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(input);
  expect(screen.getByText(/not a confirmed booking/)).toBeInTheDocument();
  expect(storage).not.toHaveBeenCalled();
  storage.mockRestore();
});
const input = {
  name: "Alex Nguyen",
  email: "alex@example.com",
  phone: "+44 7700 900123",
  vehicleId: "pink",
  rentalPlan: "day",
  pickup: "hcm",
  startDate: "2027-02-10",
  endDate: "2027-02-12",
  note: "",
  consent: true,
  website: "",
  locale: "en",
};
it("blocks reversed rental dates before sending and translates the date-order error", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const view = render(<RentalForm />);
  fillForm();
  fireEvent.change(screen.getByLabelText("Return date"), {
    target: { value: "2027-02-09" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await screen.findByText("Return date must be after the start date.");
  expect(fetchMock).not.toHaveBeenCalled();
  language.locale = "vi";
  view.rerender(<RentalForm />);
  expect(
    screen.getByText("Ngày trả xe phải sau ngày bắt đầu."),
  ).toBeInTheDocument();
});
it("renders Vietnamese labels and dynamically translates existing validation errors", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const view = render(<RentalForm />);
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  await screen.findByText("Enter a valid email address.");
  language.locale = "vi";
  view.rerender(<RentalForm />);
  expect(screen.getByText("Nhập địa chỉ email hợp lệ.")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Nhập số điện thoại quốc tế hợp lệ có mã quốc gia (ví dụ +84).",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Gửi yêu cầu" }),
  ).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});
it("keeps an enquiry editable after a transport failure and retries with a loading state", async () => {
  let finish: (value: unknown) => void = () => {};
  const fetchMock = vi
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
  vi.stubGlobal("fetch", fetchMock);
  render(<RentalForm />);
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));
  const retry = await screen.findByRole("button", { name: "Retry enquiry" });
  expect(screen.getByLabelText("Full name")).toHaveValue("Alex Nguyen");
  fireEvent.click(retry);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled(),
  );
  finish({
    status: 201,
    json: async () => ({ id: "REQ-RETRY", status: "new" }),
  });
  await screen.findByText("REQ-RETRY");
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
it("rejects malformed email, unknown choices, missing consent and oversized notes", () => {
  for (const override of [
    { email: "wrong" },
    { name: " " },
    { vehicleId: "unknown" },
    { pickup: "other" },
    { consent: false },
    { note: "x".repeat(1001) },
  ])
    expect(rentalSchema.safeParse({ ...input, ...override }).success).toBe(
      false,
    );
});
it("validates international phones and a strictly later return date", () => {
  expect(rentalSchema.safeParse(input).success).toBe(true);
  expect(
    rentalSchema.safeParse({ ...input, phone: "+1 (415) 555-0123" }).success,
  ).toBe(true);
  for (const phone of ["abc12345678", "+44", "+000000000", "+1234567890123456"])
    expect(rentalSchema.safeParse({ ...input, phone }).success).toBe(false);
  for (const endDate of ["2027-02-10", "2027-02-09", "2027-02-30"])
    expect(rentalSchema.safeParse({ ...input, endDate }).success).toBe(false);
});
