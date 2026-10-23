import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RentalCatalog,
  RentalDetail,
  VehicleVisual,
  rentalColor,
} from "@/components/rental-catalog";
import { fleet } from "@/data/fleet";

const language = vi.hoisted(() => ({ locale: "en" as "vi" | "en" }));
vi.mock("@/components/language", () => ({
  useLanguage: () => ({
    locale: language.locale,
    setLocale: vi.fn(),
    t: (viText: string, enText: string) =>
      language.locale === "vi" ? viText : enText,
  }),
}));

vi.mock("@/components/scooter-video", () => ({
  ScooterVideo: () => <div data-testid="scooter-video">Scooter Video</div>,
}));

beforeEach(() => {
  language.locale = "en";
  window.history.replaceState({}, "", "/models");
});

describe("rentalColor helper", () => {
  it("translates pink and white colors properly", () => {
    const t = (viText: string, enText: string) =>
      language.locale === "vi" ? viText : enText;

    language.locale = "vi";
    expect(rentalColor("pink", t)).toBe("Hồng phấn");
    expect(rentalColor("white", t)).toBe("Trắng ngọc");

    language.locale = "en";
    expect(rentalColor("pink", t)).toBe("Blush pink");
    expect(rentalColor("white", t)).toBe("Pearl white");
  });

  it("falls back to 'Phiên bản cũ / Previous variant' for historic ids without remapping", () => {
    const t = (viText: string, enText: string) =>
      language.locale === "vi" ? viText : enText;

    language.locale = "vi";
    expect(rentalColor("ivory", t)).toBe("Phiên bản cũ");
    expect(rentalColor("graphite", t)).toBe("Phiên bản cũ");
    expect(rentalColor("blue", t)).toBe("Phiên bản cũ");
    expect(rentalColor("unknown_id", t)).toBe("Phiên bản cũ");

    language.locale = "en";
    expect(rentalColor("ivory", t)).toBe("Previous variant");
    expect(rentalColor("graphite", t)).toBe("Previous variant");
    expect(rentalColor("blue", t)).toBe("Previous variant");
  });
});

describe("VehicleVisual component", () => {
  it("renders next/image via ImageSlot without concept caption for pink scooter", () => {
    language.locale = "vi";
    const pinkVehicle = fleet.find((v) => v.id === "pink")!;
    const { container } = render(<VehicleVisual vehicle={pinkVehicle} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("pink-front-34.webp"));
    expect(img).toHaveAttribute(
      "alt",
      expect.stringContaining("Evo Grand Lite"),
    );
    expect(screen.queryByText(/Ảnh concept minh họa/)).not.toBeInTheDocument();
    expect(container.querySelector(".fleet-photo")).toBeInTheDocument();
  });

  it("renders next/image via ImageSlot for white scooter when image is present", () => {
    language.locale = "vi";
    const whiteVehicle = fleet.find((v) => v.id === "white")!;
    const { container } = render(<VehicleVisual vehicle={whiteVehicle} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("white-front-34.webp"));
    expect(container.querySelector(".fleet-photo")).toBeInTheDocument();
  });
});

describe("RentalCatalog", () => {
  it("renders exactly 2 cards", () => {
    language.locale = "vi";
    render(<RentalCatalog />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);

    expect(screen.getByRole("link", { name: /Xem mẫu xe.*Hồng phấn/i })).toHaveAttribute(
      "href",
      "/models/evo-grand-lite?color=pink",
    );
    expect(screen.getByRole("link", { name: /Xem mẫu xe.*Trắng ngọc/i })).toHaveAttribute(
      "href",
      "/models/evo-grand-lite?color=white",
    );

    expect(screen.getAllByRole("link", { name: /Đăng ký thuê xe/i })[0]).toHaveAttribute(
      "href",
      "/rent?vehicle=pink",
    );
    expect(screen.getAllByRole("link", { name: /Đăng ký thuê xe/i })[1]).toHaveAttribute(
      "href",
      "/rent?vehicle=white",
    );
  });

  it("supports searching and color filtering, and resets cleanly", () => {
    language.locale = "vi";
    render(<RentalCatalog />);

    const colorSelect = screen.getByLabelText("Màu sắc");
    fireEvent.change(colorSelect, { target: { value: "pink" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { name: /Hồng phấn/i }),
    ).toBeInTheDocument();

    const searchInput = screen.getByLabelText("Tìm kiếm xe");
    fireEvent.change(searchInput, { target: { value: "không có màu này" } });
    expect(
      screen.getByText("Chưa tìm thấy phiên bản phù hợp."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("renders catalog without concept wording", () => {
    language.locale = "en";
    render(<RentalCatalog />);

    expect(screen.queryByText(/Concept images and sample specifications/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});

describe("RentalDetail", () => {
  it("defaults to pink with real photo gallery, accessible thumbnails, and ScooterVideo", () => {
    language.locale = "en";
    render(<RentalDetail />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Evo Grand Lite");
    expect(screen.getByRole("link", { name: /Request a rental/i })).toHaveAttribute(
      "href",
      "/rent?vehicle=pink",
    );

    // Gallery with accessible thumbnail buttons
    const thumbButtons = screen.getAllByRole("button", { name: /view|profile|front|rear|compartment/i });
    expect(thumbButtons.length).toBeGreaterThanOrEqual(4);
    expect(thumbButtons[0]).toHaveAttribute("aria-pressed", "true");

    // Switching thumbnail updates active state
    fireEvent.click(thumbButtons[1]);
    expect(thumbButtons[1]).toHaveAttribute("aria-pressed", "true");
    expect(thumbButtons[0]).toHaveAttribute("aria-pressed", "false");

    // Video is displayed for pink
    expect(screen.getByTestId("scooter-video")).toBeInTheDocument();
  });

  it("supports white query parameter and renders white photo gallery", () => {
    window.history.replaceState({}, "", "/models/evo-grand-lite?color=white");
    language.locale = "en";
    render(<RentalDetail />);

    expect(screen.getByRole("link", { name: /Request a rental/i })).toHaveAttribute(
      "href",
      "/rent?vehicle=white",
    );

    // White shows real photo gallery
    const thumbButtons = screen.getAllByRole("button", { name: /view/i });
    expect(thumbButtons.length).toBe(3);
    expect(thumbButtons[0]).toHaveAttribute("aria-pressed", "true");

    // Switching thumbnail updates active state
    fireEvent.click(thumbButtons[1]);
    expect(thumbButtons[1]).toHaveAttribute("aria-pressed", "true");
    expect(thumbButtons[0]).toHaveAttribute("aria-pressed", "false");

    // Clicking Pink color button restores pink gallery and video
    fireEvent.click(screen.getByRole("button", { name: /Blush pink/i }));
    expect(screen.getByRole("link", { name: /Request a rental/i })).toHaveAttribute(
      "href",
      "/rent?vehicle=pink",
    );
    expect(screen.getByTestId("scooter-video")).toBeInTheDocument();
  });
});
