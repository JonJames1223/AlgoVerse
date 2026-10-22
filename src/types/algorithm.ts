export type AlgorithmId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
export type Operation =
  | 'ready'
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'select'
  | 'sorted'
  | 'complete';

export interface ArrayItem {
  readonly id: number;
  readonly value: number;
}

/** A complete, immutable frame. Rendering and playback never execute algorithm logic. */
export interface SortSnapshot {
  readonly items: readonly ArrayItem[];
  readonly operation: Operation;
  readonly active: readonly number[];
  readonly sorted: readonly number[];
  readonly pointers: Readonly<Record<string, number>>;
  readonly comparisons: number;
  readonly swaps: number;
  /** Main-array writes from buffered merges; separate from pairwise swaps. */
  readonly writes: number;
  readonly buffer: readonly ArrayItem[];
  readonly line: number;
  readonly explanation: string;
  readonly advanced: string;
}

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  tagline: string;
  description: string;
  intuition: string;
  application: string;
  strength: string;
  weakness: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  complexityNote?: string;
  stable: boolean;
  level: 'Beginner' | 'Intermediate';
  pointerHelp: string;
  pseudocode: readonly string[];
  accent: 'violet' | 'cyan' | 'amber';
}
