import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { RentalAdmin } from "@/components/rental-admin";

const language = vi.hoisted(() => ({ locale: "en" as "vi" | "en" }));
vi.mock("@/components/language", () => ({
  useLanguage: () => ({
    locale: language.locale,
    setLocale: (locale: "vi" | "en") => {
      language.locale = locale;
    },
    t: (vi: string, en: string) => (language.locale === "vi" ? vi : en),
  }),
}));
const transport = vi.fn<typeof fetch>();
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const rental = {
  id: "request-1",
  name: "Test Customer",
  email: "customer@example.test",
  phone: "+84000111222",
  vehicleId: "ivory",
  startDate: "2026-10-20",
  endDate: "2026-10-22",
  pickup: "Test pickup",
  note: '<img src=x onerror="alert(1)">',
  locale: "vi",
  status: "new",
  createdAt: "2026-10-15T10:00:00.000Z",
};
beforeEach(() => {
  language.locale = "en";
  transport.mockReset();
  vi.stubGlobal("fetch", transport);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

it("checks the session before offering password login and keeps login errors generic", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: false }))
    .mockResolvedValueOnce(response({ error: "sensitive server detail" }, 401));
  render(<RentalAdmin />);
  const password = await screen.findByLabelText("Admin password");
  expect(transport).toHaveBeenNthCalledWith(
    1,
    "/api/admin/session",
    expect.objectContaining({ credentials: "same-origin" }),
  );
  expect(transport).toHaveBeenCalledTimes(1);
  fireEvent.change(password, { target: { value: "isolated-test-fixture" } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to sign in. Check your password and try again.",
  );
  expect(screen.queryByText(/sensitive server detail/)).not.toBeInTheDocument();
  expect(password).toHaveValue("");
  expect(transport).toHaveBeenNthCalledWith(
    2,
    "/api/admin/login",
    expect.objectContaining({
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ password: "isolated-test-fixture" }),
    }),
  );
});

it("loads a protected card list and renders customer notes only as safe text", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }));
  const { container } = render(<RentalAdmin />);
  expect(
    await screen.findByRole("heading", { name: rental.name }),
  ).toBeInTheDocument();
  expect(transport).toHaveBeenNthCalledWith(
    2,
    "/api/admin/rentals?q=&status=",
    expect.objectContaining({ credentials: "same-origin" }),
  );
  expect(
    screen.getByText(
      "Counts reflect only the latest returned results, not all stored requests.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(rental.email)).toBeInTheDocument();
  expect(screen.getByText(rental.note)).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
  expect(container.querySelector("table")).toBeNull();
});

it.each([
  ["en", "6 months"],
  ["vi", "6 tháng"],
] as const)("shows the selected rental plan in %s", async (locale, label) => {
  language.locale = locale;
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(
      response({ rentals: [{ ...rental, rentalPlan: "half-year" }] }),
    );
  render(<RentalAdmin />);
  expect(await screen.findByText(label)).toBeInTheDocument();
});

it("saves a selected status through the protected PATCH transport", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }))
    .mockResolvedValueOnce(response({ ok: true }));
  render(<RentalAdmin />);
  const select = await screen.findByLabelText(
    "Update status for Test Customer",
  );
  fireEvent.change(select, { target: { value: "confirmed" } });
  fireEvent.click(screen.getByRole("button", { name: "Save status" }));
  expect(await screen.findByText("Status saved.")).toBeInTheDocument();
  expect(transport).toHaveBeenNthCalledWith(
    3,
    "/api/admin/rentals/request-1",
    expect.objectContaining({
      method: "PATCH",
      credentials: "same-origin",
      body: JSON.stringify({ status: "confirmed" }),
    }),
  );
  expect(screen.getByRole("button", { name: "Save status" })).toBeDisabled();
});

it("clears customer data immediately on logout, even before the server responds", async () => {
  let finishLogout!: (res: Response) => void;
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishLogout = resolve;
        }),
    );
  render(<RentalAdmin />);
  await screen.findByText(rental.email);
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  expect(screen.queryByText(rental.email)).not.toBeInTheDocument();
  expect(screen.queryByText(rental.name)).not.toBeInTheDocument();
  expect(transport).toHaveBeenNthCalledWith(
    3,
    "/api/admin/logout",
    expect.objectContaining({ method: "POST", credentials: "same-origin" }),
  );
  finishLogout(response({ ok: true }));
  expect(await screen.findByLabelText("Admin password")).toBeInTheDocument();
});

it("submits search and status filters and reports an empty returned subset", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }))
    .mockResolvedValueOnce(response({ rentals: [] }));
  render(<RentalAdmin />);
  await screen.findByText(rental.email);
  fireEvent.change(screen.getByLabelText("Search requests"), {
    target: { value: "not found" },
  });
  fireEvent.change(screen.getByLabelText("Filter by status"), {
    target: { value: "cancelled" },
  });
  expect(transport).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(
    await screen.findByText("No requests match these filters."),
  ).toBeInTheDocument();
  expect(screen.queryByText(rental.email)).not.toBeInTheDocument();
  expect(transport).toHaveBeenNthCalledWith(
    3,
    "/api/admin/rentals?q=not+found&status=cancelled",
    expect.objectContaining({ credentials: "same-origin" }),
  );
});

it.each(["list", "save"])(
  "clears private data and returns to login after an expired %s session",
  async (operation) => {
    transport
      .mockResolvedValueOnce(response({ authenticated: true }))
      .mockResolvedValueOnce(response({ rentals: [rental] }))
      .mockResolvedValueOnce(response({ error: "expired" }, 401));
    render(<RentalAdmin />);
    await screen.findByText(rental.email);
    if (operation === "save") {
      fireEvent.change(
        screen.getByLabelText("Update status for Test Customer"),
        { target: { value: "contacted" } },
      );
      fireEvent.click(screen.getByRole("button", { name: "Save status" }));
    } else {
      fireEvent.click(screen.getByRole("button", { name: "Search" }));
    }
    expect(await screen.findByLabelText("Admin password")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your session has expired. Please sign in again.",
    );
    expect(screen.queryByText(rental.email)).not.toBeInTheDocument();
  },
);

it("shows loading then a retryable list error rather than a false empty result", async () => {
  let finish!: (res: Response) => void;
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValueOnce(response({ rentals: [rental] }));
  render(<RentalAdmin />);
  expect(await screen.findByText("Loading requests…")).toBeInTheDocument();
  finish(response({ error: "private infrastructure error" }, 500));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to load requests. Please try again.",
  );
  expect(
    screen.queryByText("No requests match these filters."),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText(rental.email)).toBeInTheDocument();
});

it("explains unconfigured administration without suggesting a default password", async () => {
  language.locale = "vi";
  transport
    .mockResolvedValueOnce(response({ authenticated: false }))
    .mockResolvedValueOnce(response({}, 503));
  render(<RentalAdmin />);
  fireEvent.change(await screen.findByLabelText("Mật khẩu quản trị"), {
    target: { value: "isolated-test-fixture" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Chạy npm run admin:setup",
  );
  expect(screen.queryByText(/default password/i)).not.toBeInTheDocument();
});

it.each(["session", "list"])(
  "shows setup instructions for an unconfigured %s endpoint",
  async (endpoint) => {
    if (endpoint === "session")
      transport.mockResolvedValueOnce(response({}, 503));
    else
      transport
        .mockResolvedValueOnce(response({ authenticated: true }))
        .mockResolvedValueOnce(response({}, 503));
    render(<RentalAdmin />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Run npm run admin:setup",
    );
    expect(screen.getByLabelText("Admin password")).toBeInTheDocument();
  },
);

it("does not restore private data from an in-flight list after logout", async () => {
  let finishList!: (res: Response) => void;
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishList = resolve;
        }),
    )
    .mockResolvedValueOnce(response({ ok: true }));
  render(<RentalAdmin />);
  await screen.findByText("Loading requests…");
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  await screen.findByLabelText("Admin password");
  finishList(response({ rentals: [rental] }));
  await waitFor(() =>
    expect(screen.getByLabelText("Admin password")).toBeEnabled(),
  );
  expect(screen.queryByText(rental.email)).not.toBeInTheDocument();
});

it("keeps the old status after a failed save and allows retry", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }))
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response({ ok: true }));
  render(<RentalAdmin />);
  fireEvent.change(
    await screen.findByLabelText("Update status for Test Customer"),
    { target: { value: "contacted" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Save status" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to save status. Please try again.",
  );
  expect(screen.getByRole("button", { name: "Save status" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Save status" }));
  expect(await screen.findByText("Status saved.")).toBeInTheDocument();
});

it("keeps private data cleared when logout fails and offers a server logout retry", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }))
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response({ ok: true }));
  render(<RentalAdmin />);
  await screen.findByText(rental.email);
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "server sign-out could not be confirmed",
  );
  expect(screen.queryByText(rental.email)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry sign out" }));
  await waitFor(() =>
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
  );
});

it("loads protected results only after successful login", async () => {
  transport
    .mockResolvedValueOnce(response({ authenticated: false }))
    .mockResolvedValueOnce(response({ ok: true }))
    .mockResolvedValueOnce(response({ rentals: [rental] }));
  render(<RentalAdmin />);
  fireEvent.change(await screen.findByLabelText("Admin password"), {
    target: { value: "isolated-test-fixture" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(await screen.findByText(rental.email)).toBeInTheDocument();
  expect(screen.queryByLabelText("Admin password")).not.toBeInTheDocument();
});
