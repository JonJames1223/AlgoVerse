import { createTrace } from './trace';

export function bubbleSort(input: readonly number[]) {
  const { items, emit, swap, finish } = createTrace(input);
  const sorted: number[] = [];
  for (let end = items.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      const a = items[j].value;
      const b = items[j + 1].value;
      emit({
        operation: 'compare',
        line: 3,
        active: [j, j + 1],
        pointers: { j, end },
        explanation: `Compare ${a} and ${b}. ${a > b ? `${a} is larger, so this pair needs to swap.` : 'They are already in order; keep them where they are.'}`,
        advanced: `Compare a[${j}] = ${a} with a[${j + 1}] = ${b}. The sorted suffix begins after index ${end}. Swap only for a strict inversion to preserve stability.`,
      });
      if (a > b) {
        swap(j, j + 1);
        swapped = true;
        emit({
          operation: 'swap',
          line: 4,
          active: [j, j + 1],
          pointers: { j, end },
          explanation: `Swap ${a} and ${b}. The larger value, ${a}, moves one place to the right.`,
          advanced: `Exchange indices ${j} and ${j + 1}; set swapped = true. This removes one inversion without disturbing the finalized suffix.`,
        });
      }
    }
    sorted.push(end);
    emit({
      operation: 'sorted',
      line: 5,
      sorted,
      pointers: { end },
      explanation: `${items[end].value} is now in its final position. Each pass moves the largest remaining value to the right.`,
    });
    if (!swapped) {
      emit({
        operation: 'sorted',
        line: 6,
        sorted: items.map((_, i) => i),
        explanation:
          'This pass needed no swaps, so the remaining values are already sorted. We can stop early.',
        advanced:
          'No adjacent inversions remain in the unsorted prefix. Early termination gives this optimized Bubble Sort O(n) best-case time.',
      });
      break;
    }
  }
  return finish();
}
