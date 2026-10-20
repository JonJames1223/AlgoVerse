import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { isAlgorithmId } from '../data/algorithms';
import type { AlgorithmId } from '../types/algorithm';
import { readStored, writeStored } from '../utils/storage';

interface Preferences {
  speed: number;
  size: number;
  advanced: boolean;
}
interface WorkspaceState extends Preferences {
  recent: AlgorithmId[];
  update: (patch: Partial<Preferences>) => void;
  visit: (id: AlgorithmId) => void;
}
const Context = createContext<WorkspaceState | null>(null);
const defaults: Preferences = { speed: 1, size: 16, advanced: false };
function isPreferences(value: unknown): value is Preferences {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.speed === 'number' &&
    p.speed >= 0.5 &&
    p.speed <= 4 &&
    typeof p.size === 'number' &&
    Number.isInteger(p.size) &&
    p.size >= 1 &&
    p.size <= 40 &&
    typeof p.advanced === 'boolean'
  );
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(() =>
    readStored('preferences', defaults, isPreferences),
  );
  const [recent, setRecent] = useState(() =>
    readStored<AlgorithmId[]>(
      'recent',
      [],
      (value): value is AlgorithmId[] =>
        Array.isArray(value) &&
        value.length <= 3 &&
        value.every(isAlgorithmId) &&
        new Set(value).size === value.length,
    ),
  );
  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch };
      writeStored('preferences', next);
      return next;
    });
  }, []);
  const visit = useCallback((id: AlgorithmId) => {
    setRecent((current) => {
      const next = [id, ...current.filter((item) => item !== id)].slice(0, 3);
      writeStored('recent', next);
      return next;
    });
  }, []);
  return (
    <Context.Provider value={{ ...preferences, recent, update, visit }}>
      {children}
    </Context.Provider>
  );
}

// Kept with its provider so the context's nullable implementation stays private.
// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error('Workspace preferences require PreferencesProvider.');
  return context;
}
