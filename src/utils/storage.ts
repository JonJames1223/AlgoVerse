/** Storage can be unavailable, full, or manually edited. None should break a lab. */
export function readStored<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(`algoverse:${key}`) ?? 'null');
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(`algoverse:${key}`, JSON.stringify(value));
  } catch {
    /* Preferences are optional. */
  }
}
