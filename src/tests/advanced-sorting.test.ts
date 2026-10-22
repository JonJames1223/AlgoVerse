import { describe, expect, it } from 'vitest';
import { sortAlgorithms } from '../algorithms/sorting';
import { playbackReducer } from '../hooks/usePlayback';

describe('Merge Sort guarantees', () => {
  it('merges stable sorted runs with exactly n log2(n) main-array writes at powers of two', () => {
    const n = 32;
    const frames = sortAlgorithms.merge(Array.from({ length: n }, (_, i) => n - i));
    expect(frames.at(-1)?.writes).toBe(n * Math.log2(n));
    expect(frames.at(-1)?.swaps).toBe(0);
    expect(frames.at(-1)!.comparisons).toBeLessThanOrEqual(n * Math.log2(n) - n + 1);
    for (const frame of frames) {
      expect(frame.buffer.map((item) => item.value)).toEqual(
        frame.buffer.map((item) => item.value).sort((a, b) => a - b),
      );
      expect(new Set(frame.buffer.map((item) => item.id)).size).toBe(frame.buffer.length);
      if (frame.operation === 'overwrite') {
        const { lo, hi } = frame.pointers;
        const run = frame.items.slice(lo, hi + 1).map((item) => item.value);
        expect(run).toEqual([...run].sort((a, b) => a - b));
      }
    }
  });
  it('copies the smaller value and chooses the left item on ties', () => {
    const frames = sortAlgorithms.merge([2, 1, 2, 1]);
    frames.forEach((frame, index) => {
      if (frame.operation !== 'compare') return;
      const { left, right } = frame.pointers;
      const chosen = frame.items[left].value <= frame.items[right].value ? left : right;
      expect(frames[index + 1].buffer).toEqual([...frame.buffer, frame.items[chosen]]);
      expect(frame.line).toBe(4);
      expect(frames[index + 1].line).toBe(chosen === left ? 5 : 6);
    });
  });
});

describe('Quick Sort guarantees', () => {
  it('partitions correctly and never moves finalized pivots again', () => {
    const frames = sortAlgorithms.quick([5, -1, 5, 3, 0, 7, 2, 2]);
    const final = frames.at(-1)!;
    for (const frame of frames) {
      for (const index of frame.sorted) expect(frame.items[index]).toEqual(final.items[index]);
      if (frame.operation === 'sorted' && frame.line === 7) {
        const { lo, hi, pivot } = frame.pointers;
        const value = frame.items[pivot].value;
        expect(frame.items.slice(lo, pivot).every((item) => item.value < value)).toBe(true);
        expect(frame.items.slice(pivot + 1, hi + 1).every((item) => item.value >= value)).toBe(
          true,
        );
      }
    }
  });
  it('honestly exhibits quadratic last-pivot behavior on sorted, reversed, and equal inputs', () => {
    const n = 20;
    for (const input of [
      Array.from({ length: n }, (_, i) => i),
      Array.from({ length: n }, (_, i) => n - i),
      Array(n).fill(2) as number[],
    ]) {
      expect(sortAlgorithms.quick(input).at(-1)?.comparisons).toBe((n * (n - 1)) / 2);
    }
  });
});

describe('Heap Sort guarantees', () => {
  it('has a valid max heap before every extraction and preserves the finalized suffix', () => {
    const frames = sortAlgorithms.heap([4, -2, 8, 4, 1, 9, 0, -5, 3]);
    const final = frames.at(-1)!;
    for (const frame of frames) {
      for (const index of frame.sorted) expect(frame.items[index]).toEqual(final.items[index]);
      if (frame.operation === 'select' && frame.line === 2) {
        const { end } = frame.pointers;
        for (let child = 1; child <= end; child++) {
          const parent = Math.floor((child - 1) / 2);
          expect(frame.items[parent].value).toBeGreaterThanOrEqual(frame.items[child].value);
        }
      }
    }
  });
  it('bounds comparison growth and handles the all-equal linear best case', () => {
    for (const n of [16, 32, 64]) {
      const input = Array.from({ length: n }, (_, i) => n - i);
      expect(sortAlgorithms.heap(input).at(-1)!.comparisons).toBeLessThanOrEqual(
        2 * n * Math.ceil(Math.log2(n)) + 2 * n,
      );
      expect(sortAlgorithms.heap(Array(n).fill(7) as number[]).at(-1)!.comparisons).toBeLessThan(
        3 * n,
      );
    }
  });
});

describe('new algorithms retain exact backward playback', () => {
  it.each(['merge', 'quick', 'heap'] as const)(
    '%s restores the array, buffer, counters, and pointers',
    (id) => {
      const frames = sortAlgorithms[id]([4, 1, -2, 4, 0]);
      const changed = frames.findIndex(
        (frame) => frame.operation === 'swap' || frame.operation === 'overwrite',
      );
      expect(changed).toBeGreaterThan(0);
      const previous = frames[changed - 1];
      const serialized = JSON.stringify(previous);
      const state = playbackReducer(
        { index: changed, playing: true },
        { type: 'seek', index: changed - 1, last: frames.length - 1 },
      );
      expect(state.playing).toBe(false);
      expect(frames[state.index]).toBe(previous);
      expect(JSON.stringify(frames[state.index])).toBe(serialized);
      const forward = playbackReducer(state, {
        type: 'seek',
        index: changed,
        last: frames.length - 1,
      });
      expect(frames[forward.index]).toBe(frames[changed]);
    },
  );
});
