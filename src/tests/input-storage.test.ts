import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateArray, parseArray } from '../utils/arrays';
import { readStored, writeStored } from '../utils/storage';

describe('custom arrays', () => {
  it('accepts signed numbers, decimals, commas, and whitespace', () => {
    expect(parseArray('42, -17  .5, +3, 0')).toEqual({ values: [42, -17, 0.5, 3, 0] });
  });
  it.each([
    '',
    ' ',
    '2, nope, 3',
    'Infinity',
    'NaN',
    '1000',
    '1e3',
    '0x10',
    Array(41).fill('1').join(','),
  ])('rejects %s', (text) => {
    expect(parseArray(text).error).toBeTruthy();
  });
  it('makes reversed and nearly sorted data at the requested size', () => {
    const reversed = generateArray(12, 'reversed');
    expect(reversed).toHaveLength(12);
    expect(reversed).toEqual([...reversed].sort((a, b) => b - a));
    const nearly = generateArray(12, 'nearly-sorted');
    [nearly[1], nearly[2]] = [nearly[2], nearly[1]];
    expect(nearly).toEqual([...nearly].sort((a, b) => a - b));
    expect(new Set(generateArray(40, 'duplicates')).size).toBeLessThanOrEqual(5);
  });
});

describe('resilient local preferences', () => {
  const isNumber = (value: unknown): value is number => typeof value === 'number';
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });
  it('round-trips supported values', () => {
    writeStored('speed', 2);
    expect(readStored('speed', 1, isNumber)).toBe(2);
  });
  it('falls back for corrupt or incompatible storage', () => {
    window.localStorage.setItem('algoverse:speed', '{broken');
    expect(readStored('speed', 1, isNumber)).toBe(1);
    writeStored('speed', { malicious: true });
    expect(readStored('speed', 1, isNumber)).toBe(1);
  });
  it('keeps the app usable if storage access fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Full');
    });
    expect(readStored('speed', 1, isNumber)).toBe(1);
    expect(() => writeStored('speed', 2)).not.toThrow();
  });
});
