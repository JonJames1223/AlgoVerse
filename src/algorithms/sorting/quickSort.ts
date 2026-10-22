import { createTrace } from './trace';

/** Deterministic Lomuto partitioning with the last item as pivot. */
export function quickSort(input: readonly number[]) {
  const { items, emit, swap, finish } = createTrace(input);
  const sorted: number[] = [];
  const sort = (lo: number, hi: number): void => {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.push(lo);
      emit({
        operation: 'sorted',
        line: 0,
        sorted,
        pointers: { lo, hi },
        explanation: `Only ${items[lo].value} remains in this partition. It is already in its final position.`,
      });
      return;
    }
    const pivot = items[hi].value;
    let i = lo;
    emit({
      operation: 'select',
      line: 1,
      active: [hi],
      pointers: { lo, hi, pivot: hi, i },
      explanation: `Choose ${pivot}, the last value in positions ${lo}–${hi}, as the pivot. Move smaller values to its left.`,
      advanced: `Lomuto partitioning uses a[${hi}] as a deterministic pivot. i = ${lo} marks the next position for a value strictly smaller than ${pivot}.`,
    });
    for (let j = lo; j < hi; j++) {
      const value = items[j].value;
      emit({
        operation: 'compare',
        line: 3,
        active: [j, hi],
        pointers: { lo, hi, pivot: hi, i, j },
        explanation: `Compare ${value} with pivot ${pivot}. ${value < pivot ? `${value} belongs in the smaller-value region.` : `${value} stays on the greater-or-equal side for now.`}`,
        advanced: `Test a[${j}] < a[${hi}]. Values in [${lo}, ${i}) are smaller than the pivot; values in [${i}, ${j}) are greater than or equal to it.`,
      });
      if (value < pivot) {
        if (i !== j) {
          const displaced = items[i].value;
          swap(i, j);
          emit({
            operation: 'swap',
            line: 4,
            active: [i, j],
            pointers: { lo, hi, pivot: hi, i, j },
            explanation: `Swap ${value} with ${displaced}, moving ${value} into the smaller-value region at index ${i}.`,
          });
        }
        i++;
        emit({
          operation: 'select',
          line: 5,
          active: [i - 1],
          pointers: { lo, hi, pivot: hi, i, j },
          explanation: `${value} is on the smaller side. Advance the boundary to index ${i}.`,
        });
      }
    }
    if (i !== hi) {
      const displaced = items[i].value;
      swap(i, hi);
      emit({
        operation: 'swap',
        line: 6,
        active: [i, hi],
        pointers: { lo, hi, pivot: i, i },
        explanation: `Swap pivot ${pivot} with ${displaced}. The pivot lands at index ${i}, between the smaller and greater-or-equal regions.`,
      });
    }
    sorted.push(i);
    emit({
      operation: 'sorted',
      line: 7,
      sorted,
      pointers: { lo, hi, pivot: i },
      explanation: `Pivot ${pivot} is in its final position at index ${i}. Sort the partitions on either side independently.`,
    });
    sort(lo, i - 1);
    sort(i + 1, hi);
  };
  sort(0, items.length - 1);
  return finish();
}
