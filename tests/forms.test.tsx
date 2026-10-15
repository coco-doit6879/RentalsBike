import React from "react";
import { describe, expect, it } from "vitest";
import { createBookingSchema } from "@/lib/forms";
import { TestDriveForm } from "@/components/forms";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

async function fillBooking(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Họ và tên"), validBooking.name);
  await user.type(screen.getByLabelText("Số điện thoại"), validBooking.phone);
  await user.type(screen.getByLabelText("Email"), validBooking.email);
  await user.selectOptions(
    screen.getByLabelText("Tỉnh / thành phố"),
    validBooking.city,
  );
  await user.selectOptions(
    screen.getByLabelText("Phiên bản"),
    validBooking.variant,
  );
  await user.selectOptions(
    screen.getByLabelText("Showroom"),
    validBooking.dealer,
  );
  await user.click(screen.getByLabelText(/Tôi đồng ý/));
}

describe("test drive form", () => {
  it("preselects a recognized showroom appointment query and ignores an unknown id", () => {
    window.history.replaceState({}, "", "/test-drive?dealer=da-nang-demo");
    const { unmount } = render(<TestDriveForm />);
    expect(screen.getByLabelText("Showroom")).toHaveValue("da-nang-demo");
    expect(screen.getByLabelText("Tỉnh / thành phố")).toHaveValue("Đà Nẵng");
    unmount();
    window.history.replaceState({}, "", "/test-drive?dealer=unknown");
    render(<TestDriveForm />);
    expect(screen.getByLabelText("Showroom")).toHaveValue("");
    window.history.replaceState({}, "", "/");
  });
  it("offers a deterministic local error simulation and allows retry", async () => {
    const user = userEvent.setup();
    render(<TestDriveForm />);
    await fillBooking(user);
    await user.click(screen.getByLabelText("Mô phỏng lỗi gửi (chỉ demo)"));
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Lỗi mô phỏng. Không có dữ liệu nào được gửi. Vui lòng thử lại.",
    );
    expect(screen.getByLabelText("Họ và tên")).toHaveValue(validBooking.name);
    await user.click(screen.getByLabelText("Mô phỏng lỗi gửi (chỉ demo)"));
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Mô phỏng thành công",
    );
  });
  it("renders service-only fields and validates them before submitting", async () => {
    const user = userEvent.setup();
    render(<TestDriveForm service />);
    await fillBooking(user);
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    expect(
      await screen.findByText("Vui lòng chọn ngày hợp lệ trong tương lai."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày hẹn dự kiến")).toHaveAttribute(
      "type",
      "date",
    );
    expect(screen.getByLabelText("Gói dịch vụ")).toHaveAccessibleDescription(
      "Vui lòng chọn gói dịch vụ.",
    );
    await user.type(screen.getByLabelText("Ngày hẹn dự kiến"), "2099-12-01");
    await user.selectOptions(
      screen.getByLabelText("Gói dịch vụ"),
      "maintenance",
    );
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Mô phỏng thành công",
    );
  });
  it("submits locally with a disabled loading state then a non-booking success message", async () => {
    const user = userEvent.setup();
    render(<TestDriveForm />);
    await fillBooking(user);
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    expect(
      await screen.findByRole("button", { name: "Đang mô phỏng…" }),
    ).toBeDisabled();
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Mô phỏng thành công. Chưa có lịch hẹn thực tế nào được tạo.",
    );
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("");
  });
  it("shows accessible inline errors on an empty submission and discloses local-only demo behavior", async () => {
    const user = userEvent.setup();
    render(<TestDriveForm />);
    expect(screen.getByText(/không gửi dữ liệu qua mạng/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Gửi đăng ký demo" }));
    const name = screen.getByLabelText("Họ và tên");
    expect(
      await screen.findByText("Vui lòng nhập họ tên (ít nhất 2 ký tự)."),
    ).toBeInTheDocument();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(
      "Vui lòng nhập họ tên (ít nhất 2 ký tự).",
    );
    expect(
      screen.getByText("Vui lòng đồng ý để tiếp tục bản demo."),
    ).toBeInTheDocument();
  });
});

const validBooking = {
  name: "Nguyễn Minh An",
  phone: "0912345678",
  email: "an@example.test",
  city: "Hà Nội",
  variant: "evo-lite",
  dealer: "ha-noi-demo",
  consent: true,
};

describe("booking validation", () => {
  it("rejects unknown or mismatched city, variant and showroom selections", () => {
    const schema = createBookingSchema();
    for (const invalid of [
      { city: "" },
      { city: "unknown" },
      { variant: "" },
      { variant: "unknown" },
      { dealer: "" },
      { dealer: "unknown" },
      { city: "Đà Nẵng" },
    ]) {
      expect(schema.safeParse({ ...validBooking, ...invalid }).success).toBe(
        false,
      );
    }
  });
  it("requires a real future calendar date and service package only in service mode", () => {
    const service = createBookingSchema(true);
    expect(service.safeParse(validBooking).success).toBe(false);
    for (const date of ["", "2020-01-01", "2099-02-30"]) {
      expect(
        service.safeParse({
          ...validBooking,
          date,
          servicePackage: "maintenance",
        }).success,
      ).toBe(false);
    }
    expect(
      service.safeParse({
        ...validBooking,
        date: "2099-12-01",
        servicePackage: "maintenance",
      }).success,
    ).toBe(true);
    expect(
      service.safeParse({
        ...validBooking,
        date: "2099-12-01",
        servicePackage: "unknown",
      }).success,
    ).toBe(false);
  });
  it("accepts Vietnamese local and international mobile formats, rejects invalid identity fields", () => {
    const schema = createBookingSchema();
    expect(schema.safeParse(validBooking).success).toBe(true);
    expect(
      schema.safeParse({ ...validBooking, phone: "+84 912 345 678" }).success,
    ).toBe(true);
    for (const invalid of [
      { name: " " },
      { phone: "12345" },
      { email: "not-email" },
      { consent: false },
    ]) {
      expect(schema.safeParse({ ...validBooking, ...invalid }).success).toBe(
        false,
      );
    }
  });
});
