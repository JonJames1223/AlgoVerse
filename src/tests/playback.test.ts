import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playbackReducer, usePlayback } from '../hooks/usePlayback';
import { sortAlgorithms } from '../algorithms/sorting';

describe('playback state machine', () => {
  it('restores the exact prior snapshot, including counters, pointers, and explanations', () => {
    const trace = sortAlgorithms.bubble([3, 1, 2]);
    let state = { index: 0, playing: false };
    const last = trace.length - 1;
    state = playbackReducer(state, { type: 'seek', index: 1, last });
    const before = trace[state.index];
    state = playbackReducer(state, { type: 'seek', index: 2, last });
    expect(trace[state.index].swaps).toBe(1);
    state = playbackReducer(state, { type: 'seek', index: state.index - 1, last });
    expect(trace[state.index]).toBe(before);
    expect(trace[state.index].swaps).toBe(0);
  });
  it('clamps seeking and pauses when stepping', () => {
    expect(
      playbackReducer({ index: 2, playing: true }, { type: 'seek', index: -1, last: 9 }),
    ).toEqual({ index: 0, playing: false });
    expect(
      playbackReducer({ index: 2, playing: true }, { type: 'seek', index: 200, last: 9 }),
    ).toEqual({ index: 9, playing: false });
  });
  it('ignores stale ticks after pause and resets playback atomically', () => {
    const paused = { index: 4, playing: false };
    expect(playbackReducer(paused, { type: 'tick', last: 8 })).toBe(paused);
    expect(playbackReducer({ index: 4, playing: true }, { type: 'reset' })).toEqual({
      index: 0,
      playing: false,
    });
  });
  it('replays from the beginning at completion and resumes from the current step', () => {
    expect(playbackReducer({ index: 8, playing: false }, { type: 'play', last: 8 })).toEqual({
      index: 0,
      playing: true,
    });
    expect(playbackReducer({ index: 4, playing: false }, { type: 'play', last: 8 })).toEqual({
      index: 4,
      playing: true,
    });
  });
});

describe('playback scheduler', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });
  it('advances, pauses without drift, resumes, and stops at the final frame', () => {
    const { result } = renderHook(() => usePlayback(4, 1));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(700));
    expect(result.current.index).toBe(1);
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(1);
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(700));
    act(() => vi.advanceTimersByTime(700));
    expect(result.current.index).toBe(3);
    expect(result.current.playing).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('changes speed without accumulating timers and cleans up on unmount', () => {
    const { result, rerender, unmount } = renderHook(({ speed }) => usePlayback(20, speed), {
      initialProps: { speed: 1 },
    });
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(200));
    rerender({ speed: 2 });
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(349));
    expect(result.current.index).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.index).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('reset cancels an active run and seek does not restart it', () => {
    const { result } = renderHook(() => usePlayback(10, 1));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(700));
    act(() => result.current.reset());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
    expect(result.current.playing).toBe(false);
    act(() => result.current.seek(3));
    expect(vi.getTimerCount()).toBe(0);
    expect(result.current.index).toBe(3);
  });
});
