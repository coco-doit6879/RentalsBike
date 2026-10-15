import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof window !== "undefined") {
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: Observer,
});
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }),
});
}
