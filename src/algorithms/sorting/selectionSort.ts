import { createTrace } from './trace';

export function selectionSort(input: readonly number[]) {
  const { items, emit, swap, finish } = createTrace(input);
  const sorted: number[] = [];
  for (let i = 0; i < items.length - 1; i++) {
    let min = i;
    emit({
      operation: 'select',
      line: 1,
      active: [i],
      pointers: { i, min },
      explanation: `Start at ${items[i].value}. Find the smallest value in the remaining unsorted region.`,
    });
    for (let j = i + 1; j < items.length; j++) {
      const candidate = items[j].value;
      const minimum = items[min].value;
      emit({
        operation: 'compare',
        line: 3,
        active: [min, j],
        pointers: { i, j, min },
        explanation: `Compare ${candidate} with the current minimum, ${minimum}. ${candidate < minimum ? `${candidate} is the new minimum.` : `Keep ${minimum} as the minimum.`}`,
        advanced: `Test a[${j}] < a[${min}]. The prefix [0, ${i}) is finalized; min identifies the least value scanned in [${i}, ${j}].`,
      });
      if (candidate < minimum) {
        min = j;
        emit({
          operation: 'select',
          line: 4,
          active: [min],
          pointers: { i, j, min },
          explanation: `Remember ${candidate} at index ${min} as the smallest value found so far.`,
        });
      }
    }
    if (min !== i) {
      const a = items[i].value;
      const b = items[min].value;
      swap(i, min);
      emit({
        operation: 'swap',
        line: 5,
        active: [i, min],
        pointers: { i, min },
        explanation: `Swap ${a} and ${b}. The smallest remaining value, ${b}, takes position ${i}.`,
        advanced: `Swap a[${i}] and a[${min}]. This non-adjacent exchange can change the relative order of equal values, so Selection Sort is not stable.`,
      });
    }
    sorted.push(i);
    emit({
      operation: 'sorted',
      line: 6,
      sorted,
      pointers: { i },
      explanation: `${items[i].value} is in its final position. The sorted region grows from left to right.`,
    });
  }
  return finish();
}
