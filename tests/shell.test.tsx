import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
import { Header, CookieBanner } from "@/components/shell";
it("opens mobile navigation and closes with escape", () => {
  render(<Header />);
  fireEvent.click(screen.getByRole("button", { name: "Mở menu" }));
  expect(
    screen.getByRole("dialog", { name: "Menu điều hướng" }),
  ).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
it("persists only a local cookie preference", () => {
  localStorage.clear();
  render(<CookieBanner />);
  fireEvent.click(screen.getByRole("button", { name: "Chỉ thiết yếu" }));
  expect(localStorage.getItem("evo-cookie-choice")).toBe("essential");
  expect(
    screen.queryByRole("region", { name: "Tùy chọn quyền riêng tư" }),
  ).not.toBeInTheDocument();
});
