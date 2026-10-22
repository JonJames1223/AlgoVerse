import type { ArrayItem } from '../../types/algorithm';
import { createTrace } from './trace';

/** Stable top-down Merge Sort. Each write-back frame commits one complete merged run. */
export function mergeSort(input: readonly number[]) {
  const { items, emit, writeRange, finish } = createTrace(input);
  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    emit({
      operation: 'select',
      line: 1,
      active: [lo, hi],
      sorted: [],
      pointers: { lo, mid, hi },
      explanation: `Split indices ${lo}–${hi} into ${lo}–${mid} and ${mid + 1}–${hi}. Sort the smaller halves first.`,
    });
    sort(lo, mid);
    sort(mid + 1, hi);
    const buffer: ArrayItem[] = [];
    let left = lo;
    let right = mid + 1;
    while (left <= mid && right <= hi) {
      const a = items[left];
      const b = items[right];
      emit({
        operation: 'compare',
        line: 4,
        active: [left, right],
        sorted: [],
        buffer,
        pointers: { lo, mid, hi, left, right },
        explanation: `Compare ${a.value} from the left half with ${b.value} from the right. ${a.value <= b.value ? a.value : b.value} goes into the buffer next.`,
        advanced: `Compare a[${left}] and a[${right}]. Both source runs are sorted. Choosing the left item on a tie preserves the original order of equal values.`,
      });
      const chosen = a.value <= b.value ? left : right;
      buffer.push(items[chosen]);
      emit({
        operation: 'select',
        line: a.value <= b.value ? 5 : 6,
        active: [chosen],
        buffer,
        pointers: { lo, mid, hi, left, right },
        explanation: `Copy ${items[chosen].value} into the temporary buffer: [${buffer.map((item) => item.value).join(', ')}]. The main array stays unchanged until this merge is ready.`,
      });
      if (a.value <= b.value) left++;
      else right++;
    }
    const remaining =
      left <= mid
        ? Array.from({ length: mid - left + 1 }, (_, index) => left + index)
        : Array.from({ length: hi - right + 1 }, (_, index) => right + index);
    buffer.push(...remaining.map((index) => items[index]));
    emit({
      operation: 'select',
      line: 7,
      active: remaining,
      buffer,
      pointers: { lo, mid, hi },
      explanation: `One half is exhausted. Append the remaining ${remaining.length} value${remaining.length === 1 ? '' : 's'} without further comparisons. The buffer is now sorted.`,
    });
    writeRange(lo, buffer);
    const range = Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
    emit({
      operation: 'overwrite',
      line: 8,
      active: range,
      buffer,
      pointers: { lo, mid, hi },
      explanation: `Write [${buffer.map((item) => item.value).join(', ')}] back into positions ${lo}–${hi}. This step performs ${buffer.length} main-array writes, not swaps.`,
      advanced: `Commit the ${buffer.length}-item merged run to a[${lo}..${hi}]. The visualizer groups this write-back into one frame so every main-array snapshot preserves unique item identities. Buffer writes are excluded from the main-array write counter.`,
    });
    emit({
      operation: 'sorted',
      line: 9,
      sorted: range,
      pointers: { lo, mid, hi },
      explanation: `Positions ${lo}–${hi} form a sorted run. ${lo === 0 && hi === items.length - 1 ? 'The entire array is now sorted.' : 'A later merge may still move these values.'}`,
    });
  };
  sort(0, items.length - 1);
  return finish();
}
