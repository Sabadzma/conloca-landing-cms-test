import "@testing-library/jest-dom/vitest"

// jsdom has no matchMedia; components subscribe to motion and breakpoint queries.
Object.defineProperty(window, "matchMedia", {
  value: (media: string) => ({
    media,
    matches: false,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
  writable: true,
})
