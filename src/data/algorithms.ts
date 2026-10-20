import type { AlgorithmId, AlgorithmInfo } from '../types/algorithm';

export const algorithmIds: readonly AlgorithmId[] = ['bubble', 'selection', 'insertion'];
export function isAlgorithmId(value: unknown): value is AlgorithmId {
  return value === 'bubble' || value === 'selection' || value === 'insertion';
}

export const algorithms: Record<AlgorithmId, AlgorithmInfo> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    tagline: 'Small swaps. A bigger picture.',
    accent: 'violet',
    description:
      'Compare neighbors. Swap what’s out of order. Watch the largest values rise to the top.',
    intuition:
      'Walk across the array, comparing neighboring values. Swap them if the left value is larger. After each pass, the largest remaining value is in its final position. Stop when a pass makes no swaps.',
    application:
      'A useful first model for understanding comparisons, inversions, and why some algorithms scale poorly. Rarely used for large real-world datasets.',
    strength: 'Simple, stable, and able to stop early on already sorted input.',
    weakness: 'Repeated passes make it inefficient on large or reversed arrays.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    pseudocode: [
      'for end = n − 1 down to 1',
      '  swapped = false',
      '  for j = 0 to end − 1',
      '    if a[j] > a[j + 1]',
      '      swap(a[j], a[j + 1]); swapped = true',
      '  mark end as sorted',
      '  if not swapped: break',
    ],
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    tagline: 'Find the smallest. Build the order.',
    accent: 'cyan',
    description:
      'Scan for the minimum, put it in place, and grow a sorted region one value at a time.',
    intuition:
      'Scan the unsorted region to find its smallest value. Swap that value into the first unsorted position. Repeat with the remaining region until every position is filled.',
    application:
      'Illustrates a selection strategy and can be useful on tiny datasets when writes cost more than comparisons: it performs at most n − 1 swaps.',
    strength: 'Predictable behavior, constant auxiliary space, and few swaps.',
    weakness: 'Always makes n(n − 1)/2 comparisons. Non-adjacent swaps mean it is not stable.',
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    pseudocode: [
      'for i = 0 to n − 2',
      '  min = i',
      '  for j = i + 1 to n − 1',
      '    if a[j] < a[min]',
      '      min = j',
      '  if min ≠ i: swap(a[i], a[min])',
      '  mark i as sorted',
    ],
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    tagline: 'A place for every value.',
    accent: 'amber',
    description:
      'Take the next value and slide it into the right place. Just like sorting a hand of cards.',
    intuition:
      'Treat the first value as a sorted region. Take the next value and swap it left past larger neighbors until it fits. Each insertion grows the sorted region by one.',
    application:
      'Useful for small or nearly sorted datasets, and often used inside hybrid sorting algorithms to handle small partitions.',
    strength: 'Stable and adaptive: only O(n) work when the array is already sorted.',
    weakness:
      'Quadratic work on reversed input. This visual version uses adjacent swaps; a shift-based version needs fewer writes.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    pseudocode: [
      'for i = 1 to n − 1',
      '  j = i',
      '  while j > 0',
      '    if a[j − 1] ≤ a[j]: break',
      '    swap(a[j − 1], a[j]); j = j − 1',
      '  mark prefix [0..i] as sorted',
    ],
  },
};
