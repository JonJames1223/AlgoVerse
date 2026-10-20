import { createTrace } from './trace';

/** Adjacent-swap insertion sort keeps every frame a permutation of the input. */
export function insertionSort(input: readonly number[]) {
  const { items, emit, swap, finish } = createTrace(input);
  for (let i = 1; i < items.length; i++) {
    let j = i;
    const key = items[i].value;
    emit({
      operation: 'select',
      line: 1,
      active: [j],
      sorted: Array.from({ length: i }, (_, k) => k),
      pointers: { i, j },
      explanation: `Pick ${key}. Move it left until it fits into the sorted region, like inserting a card into your hand.`,
      advanced: `The prefix a[0..${i - 1}] is sorted but not finalized. Insert the item at index ${i} using adjacent swaps; j tracks its current position.`,
    });
    while (j > 0) {
      const left = items[j - 1].value;
      emit({
        operation: 'compare',
        line: 3,
        active: [j - 1, j],
        sorted: [],
        pointers: { i, j },
        explanation: `Compare ${key} with ${left} on its left. ${left > key ? `${key} belongs before ${left}.` : `${key} is in the right place; stop moving left.`}`,
        advanced: `Test a[${j - 1}] > a[${j}]. ${left > key ? 'An adjacent inversion remains.' : 'The ordering condition is satisfied.'} Equal values are never swapped, preserving stability.`,
      });
      if (left <= key) break;
      swap(j - 1, j);
      emit({
        operation: 'swap',
        line: 4,
        active: [j - 1, j],
        pointers: { i, j: j - 1 },
        explanation: `Swap ${key} and ${left}. ${key} moves left one position; ${left} shifts right.`,
        advanced: `Exchange a[${j - 1}] and a[${j}], then decrement j. The inserted item is now at index ${j - 1}.`,
      });
      j--;
    }
    emit({
      operation: 'sorted',
      line: 5,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      pointers: { i, j },
      explanation: `${key} is inserted. The first ${i + 1} values are sorted relative to one another; later insertions may still shift them.`,
      advanced: `Invariant restored: a[0..${i}] is sorted. Unlike Selection Sort's prefix, these positions are not yet final.`,
    });
  }
  return finish();
}
