import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface Props {
  index: number;
  last: number;
  playing: boolean;
  toggle: () => void;
  reset: () => void;
  seek: (index: number) => void;
}

export function PlaybackControls({ index, last, playing, toggle, reset, seek }: Props) {
  return (
    <div className="playback-controls">
      <div className="playback-buttons">
        <button
          className="icon-button"
          title="Reset to the original input"
          aria-label="Reset visualization"
          disabled={index === 0 && !playing}
          onClick={reset}
        >
          <RotateCcw size={17} />
        </button>
        <span className="control-divider" />
        <button
          className="icon-button"
          title="Step backward"
          aria-label="Step backward"
          disabled={index === 0}
          onClick={() => seek(index - 1)}
        >
          <SkipBack size={18} />
        </button>
        <button className="button primary play-button" onClick={toggle}>
          {playing ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          {playing ? 'Pause' : index === last ? 'Replay' : index === 0 ? 'Play' : 'Resume'}
        </button>
        <button
          className="icon-button"
          title="Step forward"
          aria-label="Step forward"
          disabled={index === last}
          onClick={() => seek(index + 1)}
        >
          <SkipForward size={18} />
        </button>
      </div>
      <div className="timeline">
        <input
          aria-label="Visualization step"
          type="range"
          min="0"
          max={last}
          value={index}
          onChange={(event) => seek(Number(event.target.value))}
        />
        <span className="step-label">
          Step <strong data-testid="step-index">{index}</strong>
          <span>/ {last}</span>
        </span>
      </div>
    </div>
  );
}
