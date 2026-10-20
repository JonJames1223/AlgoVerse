import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import type { AlgorithmId, SortSnapshot } from '../../types/algorithm';

export const sortAlgorithms: Record<
  AlgorithmId,
  (input: readonly number[]) => readonly SortSnapshot[]
> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
};
