import { createTrace } from './trace';

/** In-place max-heap sorting with iterative sift-down and an inclusive heap boundary. */
export function heapSort(input: readonly number[]) {
  const { items, emit, swap, finish } = createTrace(input);
  const sorted: number[] = [];
  const siftDown = (start: number, end: number) => {
    let root = start;
    while (2 * root + 1 <= end) {
      const left = 2 * root + 1;
      const right = left + 1;
      let largest = root;
      emit({
        operation: 'compare',
        line: 8,
        active: [left, largest],
        pointers: { root, end, left, largest },
        explanation: `Compare left child ${items[left].value} with parent ${items[root].value}. A max heap keeps the larger value above its children.`,
      });
      if (items[left].value > items[largest].value) largest = left;
      if (right <= end) {
        emit({
          operation: 'compare',
          line: 9,
          active: [right, largest],
          pointers: { root, end, left, right, largest },
          explanation: `Compare right child ${items[right].value} with the largest candidate, ${items[largest].value}. Keep the larger candidate.`,
          advanced: `Test a[${right}] > a[${largest}]. The active heap ends at index ${end}; its finalized suffix is never included in sift-down.`,
        });
        if (items[right].value > items[largest].value) largest = right;
      }
      if (largest === root) {
        emit({
          operation: 'select',
          line: 10,
          active: [root],
          pointers: { root, end, largest },
          explanation: `${items[root].value} is at least as large as its children. This subtree already satisfies the max-heap rule; stop sifting.`,
        });
        return;
      }
      const parent = items[root].value;
      const child = items[largest].value;
      const previous = root;
      swap(root, largest);
      root = largest;
      emit({
        operation: 'swap',
        line: 11,
        active: [previous, largest],
        pointers: { root, end, largest },
        explanation: `Swap ${parent} with larger child ${child}. Continue checking ${parent} at index ${root}.`,
      });
    }
  };
  for (let start = Math.floor(items.length / 2) - 1; start >= 0; start--) {
    emit({
      operation: 'select',
      line: 1,
      active: [start],
      pointers: { root: start, end: items.length - 1 },
      explanation: `Build the max heap from the bottom up. Sift down the subtree rooted at index ${start}.`,
    });
    siftDown(start, items.length - 1);
  }
  for (let end = items.length - 1; end > 0; end--) {
    emit({
      operation: 'select',
      line: 2,
      active: [0],
      pointers: { root: 0, end },
      explanation: `The max heap is ready. Its root, ${items[0].value}, is the largest value in positions 0–${end}.`,
    });
    const largest = items[0].value;
    const last = items[end].value;
    swap(0, end);
    emit({
      operation: 'swap',
      line: 3,
      active: [0, end],
      pointers: { root: 0, end },
      explanation: `Swap maximum ${largest} with ${last} at index ${end}. The maximum reaches its final position.`,
    });
    sorted.push(end);
    emit({
      operation: 'sorted',
      line: 3,
      sorted,
      pointers: { root: 0, end },
      explanation: `Finalize ${largest} at index ${end}. Shrink the heap to positions 0–${end - 1}.`,
    });
    emit({
      operation: 'select',
      line: 4,
      active: [0],
      pointers: { root: 0, end: end - 1 },
      explanation: `Restore the max-heap rule after extraction. Sift ${items[0].value} down within the remaining heap.`,
    });
    siftDown(0, end - 1);
  }
  return finish();
}
