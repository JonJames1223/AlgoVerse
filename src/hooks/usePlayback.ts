import { useEffect, useReducer } from 'react';

export interface PlaybackState {
  index: number;
  playing: boolean;
}
export type PlaybackAction =
  | { type: 'play'; last: number }
  | { type: 'pause' | 'reset' }
  | { type: 'tick'; last: number }
  | { type: 'seek'; index: number; last: number };

export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case 'play':
      return { index: state.index >= action.last ? 0 : state.index, playing: action.last > 0 };
    case 'pause':
      return { ...state, playing: false };
    case 'reset':
      return { index: 0, playing: false };
    case 'seek':
      return { index: Math.max(0, Math.min(action.index, action.last)), playing: false };
    case 'tick': {
      if (!state.playing) return state;
      const index = Math.min(state.index + 1, action.last);
      return { index, playing: index < action.last };
    }
  }
}

/** One cancellable scheduler owns time. Changing speed, pausing, or unmounting cancels it. */
export function usePlayback(frameCount: number, speed: number) {
  const [state, dispatch] = useReducer(playbackReducer, { index: 0, playing: false });
  const last = frameCount - 1;
  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setTimeout(() => dispatch({ type: 'tick', last }), 700 / speed);
    return () => window.clearTimeout(timer);
  }, [state.playing, state.index, speed, last]);
  return {
    ...state,
    last,
    toggle: () => dispatch(state.playing ? { type: 'pause' } : { type: 'play', last }),
    pause: () => dispatch({ type: 'pause' }),
    reset: () => dispatch({ type: 'reset' }),
    seek: (index: number) => dispatch({ type: 'seek', index, last }),
  };
}
