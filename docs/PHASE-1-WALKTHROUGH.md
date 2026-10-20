# Phase 1: a guided tour

The most useful starting point is to run the app, open Bubble Sort, and apply the custom input `3, 1, 2`.

1. The first forward step compares 3 and 1. The array has not changed. Comparisons = 1, swaps = 0.
2. The next step swaps them, producing `[1, 3, 2]`. Swaps = 1.
3. Step backward. The original array, comparison highlight, explanation, and zero swap count return together.
4. Continue until the array is sorted. Then use the timeline to inspect any earlier decision.

This short exercise demonstrates the main architectural choice: **algorithm computation and animation playback are separate**.

## Read these files in this order

### 1. `src/types/algorithm.ts`

`SortSnapshot` is the contract between the algorithm and the interface. It describes an entire frame: items, state highlights, pointers, counters, a pseudocode line, and two explanation levels. Each array item has both a value and a stable ID. Duplicate values therefore remain distinct objects that can move independently.

### 2. `src/algorithms/sorting/trace.ts`

`createTrace` copies the input, owns bookkeeping, and emits frozen snapshots. It counts a comparison only on a `compare` frame and a swap only on a `swap` frame. Shared items are immutable; each snapshot receives its own array and highlight lists.

The builder has no concept of animation time. Calling an algorithm immediately produces the complete deterministic trace.

### 3. The sorting functions

- **`bubbleSort.ts`:** the inner loop compares neighbors; a larger left value moves right. After a full pass, the largest remaining value is finalized. A pass without swaps ends the sort early.
- **`selectionSort.ts`:** remember the smallest value found while scanning the unsorted region, then swap it into the first unsorted position. Even sorted input still requires the same pair count. Non-adjacent swaps can reorder equal values.
- **`insertionSort.ts`:** grow a sorted prefix. Take the next item and repeatedly swap it left past larger neighbors. The prefix is sorted but can move later. Equal values are never swapped, so this implementation is stable.

Adjacent-swap Insertion Sort is a deliberate educational variant. A traditional shift-and-insert implementation is often more efficient in writes, but the adjacent-swap form keeps every displayed array a complete permutation of the original input.

### 4. `src/hooks/usePlayback.ts`

The reducer holds only `index` and `playing`. Buttons dispatch transitions; the scheduler advances the index at `700 / speed` milliseconds per snapshot. Cleanup cancels the timer when playback pauses, the speed changes, or the player unmounts.

A manual seek always pauses. At the end, Play becomes Replay and restarts at index zero. Reset also returns to index zero and stops execution. It preserves the original dataset.

### 5. `src/visualizers/SortingBars.tsx`

The SVG receives one snapshot. It calculates positions, colors, and a shared zero baseline, then asks Motion to interpolate bar positions. Negative values extend below the baseline. A zero value remains visible as a small mark.

Rendering never sorts data or increments a counter. This separation makes both the algorithm and the interface easier to reason about and test.

### 6. `src/pages/SortingLab.tsx`

The page ties together input generation, algorithm selection, playback controls, counters, explanations, and the pseudocode panel. Replacing an input remounts the player with a new trace, cleaning up the previous timer. Educational content lives separately in `src/data/algorithms.ts`.

### 7. The application shell and dashboard

`src/layouts/AppLayout.tsx` owns navigation and search. `src/pages/Dashboard.tsx` provides working lab entry points and real recently opened routes. `src/styles.css` defines the visual system and responsive layouts. `src/hooks/PreferencesProvider.tsx` persists validated preferences and recent lab IDs.

## Practice reading the code

These are optional exercises for your own understanding; they are not extra product features:

- Apply an already sorted array and compare Bubble Sort's early exit with Selection Sort's full scan.
- Apply `2, 2, 1` to Selection Sort. Follow the original item IDs in the final snapshot to see why it is unstable.
- Apply a reversed array to Insertion Sort. Count how many adjacent inversions it removes.
- Read the playback tests before editing the scheduler. They describe the behavior you need to preserve.

## Run and verify

```sh
npm ci
npm run dev
```

In another terminal:

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

The checks cover 69 unit/integration tests and 8 desktop/mobile browser scenarios. Full setup details and the existing-Chrome alternative are in the README. Phase 1 ends here; the roadmap is documentation of future work.
