import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";
import { VehicleGrid, ModelDetail } from "@/components/catalog";
it("filters vehicles and explains an empty result", () => {
  render(<VehicleGrid inventory />);
  expect(screen.getAllByRole("article")).toHaveLength(3);
  fireEvent.change(screen.getByLabelText("Màu sắc"), {
    target: { value: "blue" },
  });
  expect(screen.getAllByRole("article")).toHaveLength(1);
  fireEvent.change(screen.getByLabelText("Tìm kiếm xe"), {
    target: { value: "không tồn tại" },
  });
  expect(
    screen.getByText("Chưa tìm thấy phiên bản phù hợp."),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
  expect(screen.getAllByRole("article")).toHaveLength(3);
});
it("switches the detail color and links the selected test drive", () => {
  render(<ModelDetail />);
  fireEvent.click(screen.getByRole("button", { name: "Xanh cobalt" }));
  expect(
    screen.getByRole("link", { name: /Lái thử sắc màu này/ }),
  ).toHaveAttribute("href", "/test-drive?color=blue");
  expect(screen.getByText("20.900.000 ₫")).toBeInTheDocument();
});
