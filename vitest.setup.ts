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

// jsdom has no IntersectionObserver; dotlottie-web observes its canvas.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = "0px"
  readonly thresholds = [0]
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  value: IntersectionObserverStub,
  writable: true,
})
Object.defineProperty(globalThis, "IntersectionObserver", {
  value: IntersectionObserverStub,
  writable: true,
})
