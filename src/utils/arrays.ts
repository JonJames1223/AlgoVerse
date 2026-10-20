export type Dataset = 'random' | 'reversed' | 'nearly-sorted' | 'duplicates';
export const MAX_ARRAY_SIZE = 40;

export function generateArray(size: number, dataset: Dataset = 'random'): number[] {
  const values = Array.from({ length: size }, () =>
    dataset === 'duplicates'
      ? (Math.floor(Math.random() * 5) + 1) * 15
      : Math.floor(Math.random() * 85) + 10,
  );
  if (dataset === 'reversed') return values.sort((a, b) => b - a);
  if (dataset === 'nearly-sorted') {
    values.sort((a, b) => a - b);
    if (size > 2) [values[1], values[2]] = [values[2], values[1]];
  }
  return values;
}

export function parseArray(
  text: string,
): { values: number[]; error?: never } | { error: string; values?: never } {
  if (!text.trim()) return { error: 'Enter at least one number.' };
  const parts = text.trim().split(/[\s,]+/);
  if (parts.length > MAX_ARRAY_SIZE)
    return { error: `Use at most ${MAX_ARRAY_SIZE} values so each bar stays readable.` };
  if (parts.some((part) => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part))) {
    return { error: 'Use numbers separated by commas or spaces, such as 42, -17, 8.' };
  }
  const values = parts.map(Number);
  if (values.some((value) => !Number.isFinite(value) || Math.abs(value) > 999)) {
    return { error: 'Each value must be between −999 and 999.' };
  }
  return { values };
}
