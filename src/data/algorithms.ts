import type { AlgorithmId, AlgorithmInfo } from '../types/algorithm';

export const algorithmIds: readonly AlgorithmId[] = [
  'bubble',
  'selection',
  'insertion',
  'merge',
  'quick',
  'heap',
];
export function isAlgorithmId(value: unknown): value is AlgorithmId {
  return typeof value === 'string' && algorithmIds.some((id) => id === value);
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
    level: 'Beginner',
    pointerHelp: 'j scans neighbors · end bounds the unsorted region',
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
    level: 'Beginner',
    pointerHelp: 'i is the destination · j scans · min tracks the minimum',
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
    level: 'Beginner',
    pointerHelp: 'i expands the sorted prefix · j tracks the inserted value',
    pseudocode: [
      'for i = 1 to n − 1',
      '  j = i',
      '  while j > 0',
      '    if a[j − 1] ≤ a[j]: break',
      '    swap(a[j − 1], a[j]); j = j − 1',
      '  mark prefix [0..i] as sorted',
    ],
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    tagline: 'Divide the problem. Merge the order.',
    accent: 'cyan',
    level: 'Intermediate',
    description:
      'Split into smaller halves, then weave sorted runs together using a temporary buffer.',
    intuition:
      'Recursively split the array until each run has one value. Compare the first unmerged values of two sorted runs, copy the smaller into a buffer, then append any remaining values. Write the merged run back and repeat.',
    application:
      'Useful when stable ordering and predictable O(n log n) time matter. The merge operation also underpins external sorting of data that does not fit in memory.',
    strength:
      'Stable, predictable O(n log n) time in every case. Taking the left item on ties preserves equal-value order.',
    weakness: 'Requires O(n) auxiliary space for the merge buffer. It is not an in-place sort.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    pointerHelp:
      'lo / hi bound the run · mid splits the halves · left / right scan the source runs',
    pseudocode: [
      'mergeSort(lo, hi): return if lo ≥ hi',
      '  mid = floor((lo + hi) / 2)',
      '  mergeSort(lo, mid); mergeSort(mid + 1, hi)',
      '  buffer = []; left = lo; right = mid + 1',
      '  while both runs remain: compare a[left], a[right]',
      '    if a[left] ≤ a[right]: append left; left++',
      '    else: append right; right++',
      '  append the remaining run to buffer',
      '  a[lo..hi] = buffer',
      '  mark [lo..hi] as a sorted run',
    ],
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    tagline: 'Pick a pivot. Find the divide.',
    accent: 'violet',
    level: 'Intermediate',
    description:
      'Partition around a pivot, put it in place, then sort the smaller problems on either side.',
    intuition:
      'Choose the last value as a pivot. Scan the partition, moving values smaller than the pivot to the left. Place the pivot at the boundary, where it is finalized, and recursively sort the two sides.',
    application:
      'Partitioning is useful for fast in-memory sorting and selection problems. Production variants commonly improve pivot selection or combine strategies to guard against bad partitions.',
    strength:
      'Average O(n log n) time, with swaps performed directly in the array. Each partition finalizes a pivot.',
    weakness:
      'This deterministic last-pivot variant takes O(n²) time on sorted, reversed, or all-equal input. Non-adjacent swaps make it unstable.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(n)',
    stable: false,
    complexityNote:
      'Average time assumes randomly ordered input. Recursion uses O(log n) space on balanced partitions and O(n) in the worst case shown above.',
    pointerHelp:
      'lo / hi bound the partition · pivot is an index · i bounds smaller values · j scans',
    pseudocode: [
      'quickSort(lo, hi): return if lo ≥ hi',
      '  pivot = a[hi]; i = lo',
      '  for j = lo to hi − 1',
      '    if a[j] < pivot',
      '      if i ≠ j: swap(a[i], a[j])',
      '      i = i + 1',
      '  if i ≠ hi: swap(a[i], a[hi])',
      '  mark i as finalized',
      '  quickSort(lo, i − 1); quickSort(i + 1, hi)',
    ],
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    tagline: 'Build a heap. Bring order to the top.',
    accent: 'amber',
    level: 'Intermediate',
    description:
      'Build a max heap, move the largest value to the end, and restore the heap one extraction at a time.',
    intuition:
      'View the array as a binary tree: the children of index i are 2i + 1 and 2i + 2. Build a max heap so parents are at least as large as their children. Swap the root with the last heap item, shrink the heap, and sift the new root down.',
    application:
      'Useful when worst-case O(n log n) time and constant auxiliary space are important. Heap-based ordering also underpins priority queues.',
    strength:
      'O(n log n) worst-case time, O(1) auxiliary space, and no recursion in this iterative implementation.',
    weakness:
      'It is not stable. The heap layout and non-adjacent exchanges are less intuitive than a simple left-to-right scan.',
    best: 'O(n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    complexityNote:
      'The linear best case is possible when all values are equal, so sift-down stops immediately. With distinct values, the best case is O(n log n).',
    pointerHelp:
      'root is being sifted · end is the inclusive heap boundary · left / right / largest are indices',
    pseudocode: [
      'for start = floor(n / 2) − 1 down to 0',
      '  siftDown(start, n − 1)',
      'for end = n − 1 down to 1',
      '  swap(a[0], a[end]); mark end as finalized',
      '  siftDown(0, end − 1)',
      'siftDown(root, end):',
      '  while left = 2 × root + 1 ≤ end',
      '    largest = root; right = left + 1',
      '    if a[left] > a[largest]: largest = left',
      '    if right ≤ end and a[right] > a[largest]: largest = right',
      '    if largest = root: return',
      '    swap(a[root], a[largest]); root = largest',
    ],
  },
};
