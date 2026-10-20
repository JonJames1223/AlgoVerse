import type { ArrayItem, SortSnapshot } from '../../types/algorithm';

type Frame = Pick<SortSnapshot, 'operation' | 'line' | 'explanation'> &
  Partial<Pick<SortSnapshot, 'active' | 'sorted' | 'pointers' | 'advanced'>>;

/** Shared bookkeeping only: no UI, clocks, random numbers, or input mutations. */
export function createTrace(input: readonly number[]) {
  if (input.some((value) => !Number.isFinite(value))) {
    throw new Error('The input must contain only finite numbers.');
  }
  const items: ArrayItem[] = input.map((value, id) => Object.freeze({ value, id }));
  const frames: SortSnapshot[] = [];
  let comparisons = 0;
  let swaps = 0;
  let sorted: readonly number[] = [];
  const emit = (frame: Frame) => {
    if (frame.operation === 'compare') comparisons++;
    if (frame.operation === 'swap') swaps++;
    sorted = frame.sorted ?? sorted;
    frames.push(
      Object.freeze({
        ...frame,
        items: Object.freeze([...items]),
        active: Object.freeze([...(frame.active ?? [])]),
        sorted: Object.freeze([...sorted]),
        pointers: Object.freeze({ ...frame.pointers }),
        comparisons,
        swaps,
        advanced: frame.advanced ?? frame.explanation,
      }),
    );
  };
  const swap = (a: number, b: number) => {
    [items[a], items[b]] = [items[b], items[a]];
  };
  emit({
    operation: 'ready',
    line: 0,
    explanation: input.length
      ? `Start with ${input.length} values. Press Play or move one step at a time to see how order emerges.`
      : 'An empty array is already sorted. There is nothing to compare.',
  });
  const finish = () => {
    emit({
      operation: 'complete',
      line: -1,
      sorted: items.map((_, i) => i),
      explanation: `All done. ${items.length} values in ascending order, with ${comparisons} comparisons and ${swaps} swaps.`,
      advanced: `The array is sorted in nondecreasing order. This trace performed ${comparisons} value comparisons and ${swaps} pairwise swaps. Playback duration is not computation time.`,
    });
    return Object.freeze(frames);
  };
  return { items, emit, swap, finish };
}
