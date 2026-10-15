import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Home } from "@/components/home";
describe("Showroom home", () => {
  it("introduces Evo Lite with a working carousel and discovery links", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Định nghĩa lại",
    );
    expect(
      screen.getAllByRole("link", { name: /Khám phá mẫu xe/i })[0],
    ).toHaveAttribute("href", "/models/evo-lite");
    fireEvent.click(
      screen.getByRole("button", { name: "Banner 2: Phiên bản và màu sắc" }),
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Cá tính của bạn",
    );
    expect(
      screen.getAllByText(/Thông số mang tính tham khảo/).length,
    ).toBeGreaterThan(0);
  });
});
