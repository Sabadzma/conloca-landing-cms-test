import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useCarouselPlayback } from "./use-carousel-playback"

let time = 0
let nextFrame = 0
const frames = new Map<number, FrameRequestCallback>()

function advance(milliseconds: number) {
  time += milliseconds
  const scheduled = [...frames.values()]
  frames.clear()
  act(() => scheduled.forEach((callback) => callback(time)))
}

beforeEach(() => {
  time = 0
  nextFrame = 0
  frames.clear()
  vi.spyOn(performance, "now").mockImplementation(() => time)
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback)
    return nextFrame
  })
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("hero carousel playback", () => {
  it("fills for eight seconds before advancing and restarting the next marker", () => {
    const { result } = renderHook(() => useCarouselPlayback(3, true))
    advance(4000)
    expect(result.current.slide).toBe(0)
    expect(result.current.progress).toBe(50)
    advance(3999)
    expect(result.current.slide).toBe(0)
    expect(result.current.progress).toBeCloseTo(99.9875)
    advance(1)
    expect(result.current.slide).toBe(1)
    expect(result.current.progress).toBe(0)
    advance(16000)
    expect(result.current.slide).toBe(0)
    expect(result.current.progress).toBe(0)
  })

  it("freezes elapsed progress while paused and resumes the remaining duration", () => {
    const { result, rerender } = renderHook(
      ({ running }) => useCarouselPlayback(3, running),
      { initialProps: { running: true } },
    )
    advance(2000)
    rerender({ running: false })
    advance(60000)
    expect(result.current.slide).toBe(0)
    expect(result.current.progress).toBe(25)
    rerender({ running: true })
    advance(5999)
    expect(result.current.slide).toBe(0)
    advance(1)
    expect(result.current.slide).toBe(1)
    expect(result.current.progress).toBe(0)
  })

  it("starts a selected slide with a fresh interval and cancels work on unmount", () => {
    const { result, rerender, unmount } = renderHook(
      ({ running }) => useCarouselPlayback(3, running),
      { initialProps: { running: true } },
    )
    advance(6000)
    rerender({ running: false })
    act(() => result.current.selectSlide(2))
    expect(result.current.slide).toBe(2)
    expect(result.current.progress).toBe(0)
    rerender({ running: true })
    advance(4000)
    expect(result.current.slide).toBe(2)
    expect(result.current.progress).toBe(50)
    unmount()
    expect(frames.size).toBe(0)
  })
})
