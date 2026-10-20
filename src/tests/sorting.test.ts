import { describe, expect, it } from 'vitest';
import { sortAlgorithms } from '../algorithms/sorting';
import { algorithms, algorithmIds } from '../data/algorithms';

const cases = [
  [],
  [7],
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [2, 2, 2],
  [4, 1, 4, 1, 0],
  [-5, -9, -1, 0, 2],
  [1.2, -0.5, 0, 1.2],
  [0, 0, -0],
];

for (const id of algorithmIds) {
  describe(algorithms[id].name, () => {
    it.each(cases.map((input) => ({ input })))(
      'sorts $input without mutating the input',
      ({ input }) => {
        const original = [...input];
        const frames = sortAlgorithms[id](Object.freeze([...input]));
        expect(input).toEqual(original);
        expect(frames[0].items.map((item) => item.value)).toEqual(input);
        expect(frames.at(-1)?.items.map((item) => item.value)).toEqual(
          [...input].sort((a, b) => a - b),
        );
        expect(frames.at(-1)?.operation).toBe('complete');
        expect(frames.at(-1)?.sorted).toHaveLength(input.length);
      },
    );

    it('keeps each snapshot independent, with valid operations, highlights, and counters', () => {
      const input = [8, -2, 4, 4, 1, 0];
      const frames = sortAlgorithms[id](input);
      let comparisons = 0;
      let swaps = 0;
      frames.forEach((frame, index) => {
        if (frame.operation === 'compare') comparisons++;
        if (frame.operation === 'swap') swaps++;
        expect(frame.comparisons).toBe(comparisons);
        expect(frame.swaps).toBe(swaps);
        expect(frame.line).toBeGreaterThanOrEqual(-1);
        expect(frame.line).toBeLessThan(algorithms[id].pseudocode.length);
        expect(frame.explanation.length).toBeGreaterThan(10);
        expect(Object.isFrozen(frame)).toBe(true);
        expect(Object.isFrozen(frame.items)).toBe(true);
        expect(Object.isFrozen(frame.active)).toBe(true);
        expect(Object.isFrozen(frame.pointers)).toBe(true);
        expect(frame.items.map((item) => item.id).sort((a, b) => a - b)).toEqual(
          input.map((_, i) => i),
        );
        expect(frame.items.map((item) => item.value).sort((a, b) => a - b)).toEqual(
          [...input].sort((a, b) => a - b),
        );
        [...frame.active, ...frame.sorted, ...Object.values(frame.pointers)].forEach((pointer) => {
          expect(pointer).toBeGreaterThanOrEqual(0);
          expect(pointer).toBeLessThan(input.length);
        });
        const region = [...frame.sorted].sort((a, b) => a - b).map((i) => frame.items[i].value);
        expect(region).toEqual([...region].sort((a, b) => a - b));
        if (index > 0) {
          expect(frame.items).not.toBe(frames[index - 1].items);
          const before = frames[index - 1].items;
          if (frame.operation === 'swap') {
            const changed = frame.items
              .map((item, i) => (item.id === before[i].id ? -1 : i))
              .filter((i) => i !== -1);
            expect(changed).toHaveLength(2);
            expect([...frame.active].sort((a, b) => a - b)).toEqual(changed);
            expect(frame.items[changed[0]].id).toBe(before[changed[1]].id);
          } else expect(frame.items).toEqual(before);
        }
      });
      expect(sortAlgorithms[id](input)).toEqual(frames);
    });

    it('sorts 160 seeded, duplicate-heavy arrays', () => {
      let seed = 12345;
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let run = 0; run < 160; run++) {
        const input = Array.from(
          { length: Math.floor(random() * 26) },
          () => Math.floor(random() * 31) - 15,
        );
        const frames = sortAlgorithms[id](input);
        expect(frames.at(-1)?.items.map((item) => item.value)).toEqual(
          [...input].sort((a, b) => a - b),
        );
      }
    });

    it.each([NaN, Infinity, -Infinity])('rejects non-finite input %s', (value) => {
      expect(() => sortAlgorithms[id]([1, value])).toThrow('finite');
    });
  });
}

describe('algorithm guarantees', () => {
  it('Bubble Sort stops after a single pass on sorted input', () => {
    const frames = sortAlgorithms.bubble([1, 2, 3, 4, 5]);
    expect(frames.at(-1)?.comparisons).toBe(4);
    expect(frames.at(-1)?.swaps).toBe(0);
  });
  it('Selection Sort always compares n(n−1)/2 pairs and swaps at most n−1 times', () => {
    for (const input of cases) {
      const final = sortAlgorithms.selection(input).at(-1)!;
      expect(final.comparisons).toBe(Math.max(0, (input.length * (input.length - 1)) / 2));
      expect(final.swaps).toBeLessThanOrEqual(Math.max(0, input.length - 1));
    }
  });
  it('Insertion Sort is linear on sorted input and removes every inversion on reversed input', () => {
    expect(sortAlgorithms.insertion([1, 2, 3, 4, 5]).at(-1)?.comparisons).toBe(4);
    const final = sortAlgorithms.insertion([5, 4, 3, 2, 1]).at(-1)!;
    expect(final.swaps).toBe(10);
    expect(final.comparisons).toBe(10);
  });
  it.each(['bubble', 'insertion'] as const)(
    '%s preserves the identity order of equal values',
    (id) => {
      const final = sortAlgorithms[id]([3, 1, 3, 2, 1, 2, 3]).at(-1)!;
      for (const value of [1, 2, 3]) {
        const ids = final.items.filter((item) => item.value === value).map((item) => item.id);
        expect(ids).toEqual([...ids].sort((a, b) => a - b));
      }
    },
  );
  it('Selection Sort honestly demonstrates instability', () => {
    const final = sortAlgorithms.selection([2, 2, 1]).at(-1)!;
    expect(final.items.filter((item) => item.value === 2).map((item) => item.id)).toEqual([1, 0]);
  });
});
