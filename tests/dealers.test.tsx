import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DealerSearch, MapPanel } from "@/components/dealers";
import { dealers } from "@/data/dealers";

describe("map placeholder", () => {
  it("labels the map as non-geographic and updates an external Maps search for the selected address", async () => {
    const user = userEvent.setup();
    render(<MapPanel />);
    expect(screen.getByText(/không phải tọa độ thực/)).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Địa điểm trên sơ đồ"),
      dealers[1].id,
    );
    const link = screen.getByRole("link", {
      name: "Tìm địa chỉ minh họa trên Google Maps",
    });
    expect(link).toHaveAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealers[1].address)}`,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "Đặt lịch tại địa điểm đã chọn" }),
    ).toHaveAttribute("href", `/test-drive?dealer=${dealers[1].id}`);
  });
});

describe("demo dealer finder", () => {
  it("filters demo showrooms by province and search text with an empty state", async () => {
    const user = userEvent.setup();
    render(<DealerSearch />);
    expect(
      screen.getAllByRole("link", { name: "Đặt lịch tại đây" }),
    ).toHaveLength(3);
    await user.selectOptions(
      screen.getByLabelText("Tỉnh / thành phố"),
      "Hà Nội",
    );
    expect(
      screen.getAllByRole("link", { name: "Đặt lịch tại đây" }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("heading", { name: "Showroom Hà Nội — Demo" }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText("Tìm showroom"), "không tồn tại");
    expect(
      screen.getByText("Không tìm thấy showroom phù hợp."),
    ).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Tìm showroom"));
    await user.type(screen.getByLabelText("Tìm showroom"), "ha noi");
    expect(
      screen.getAllByRole("link", { name: "Đặt lịch tại đây" }),
    ).toHaveLength(1);
    expect(screen.getByText(/TODO: xác minh/)).toBeInTheDocument();
  });
});
