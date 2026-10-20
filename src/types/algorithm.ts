export type AlgorithmId = 'bubble' | 'selection' | 'insertion';
export type Operation = 'ready' | 'compare' | 'swap' | 'select' | 'sorted' | 'complete';

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
  stable: boolean;
  pseudocode: readonly string[];
  accent: 'violet' | 'cyan' | 'amber';
}
