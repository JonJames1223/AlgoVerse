import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { algorithms, algorithmIds, isAlgorithmId } from '../data/algorithms';
import { sortAlgorithms } from '../algorithms/sorting';
import { usePreferences } from '../hooks/PreferencesProvider';
import { usePlayback } from '../hooks/usePlayback';
import { generateArray, parseArray, type Dataset } from '../utils/arrays';
import type { AlgorithmId } from '../types/algorithm';
import { SortingBars } from '../visualizers/SortingBars';
import { PlaybackControls } from '../components/PlaybackControls';
import { EducationalPanel, PseudocodePanel } from '../components/EducationalPanel';
import { NotFound } from './Roadmap';

export function SortingLab() {
  const { algorithm } = useParams();
  return isAlgorithmId(algorithm) ? (
    <SortingWorkspace key={algorithm} algorithmId={algorithm} />
  ) : (
    <NotFound />
  );
}

function SortingWorkspace({ algorithmId }: { algorithmId: AlgorithmId }) {
  const preferences = usePreferences();
  const { visit } = preferences;
  const algorithm = algorithms[algorithmId];
  const [dataset, setDataset] = useState<Dataset>('random');
  const [input, setInput] = useState(() => generateArray(preferences.size));
  const [generation, setGeneration] = useState(0);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('42, 17, 8, 35, 23, 56, 12, 29');
  const [error, setError] = useState('');
  useEffect(() => {
    visit(algorithmId);
  }, [algorithmId, visit]);
  const replaceInput = (values: number[]) => {
    setInput(values);
    setGeneration((current) => current + 1);
  };
  return (
    <div className="page lab-page">
      <div className="lab-heading">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={14} /> Your workspace
          </Link>
          <div className="lab-title">
            <h1>{algorithm.name}</h1>
            <span className={`algorithm-type accent-${algorithm.accent}`}>
              SORTING / 0{algorithmIds.indexOf(algorithmId) + 1}
            </span>
          </div>
          <p className="page-subtitle">
            {algorithm.tagline} <span className="lab-subtitle-extra">Let’s see how it works.</span>
          </p>
        </div>
        <a className="button secondary" href="#learn">
          <CircleHelp size={16} /> Understand the algorithm <ArrowRight size={15} />
        </a>
      </div>
      <nav className="algorithm-tabs" aria-label="Sorting algorithm">
        {algorithmIds.map((id) => (
          <Link
            className={id === algorithmId ? 'active' : ''}
            aria-current={id === algorithmId ? 'page' : undefined}
            to={`/sorting/${id}`}
            key={id}
          >
            <span className={`tab-dot accent-${algorithms[id].accent}`} />
            {algorithms[id].name}
            {id === algorithmId && <span className="tab-selected">LAB</span>}
          </Link>
        ))}
      </nav>
      <section className="panel input-panel" aria-label="Dataset controls">
        <div className="input-toolbar">
          <div className="input-label">
            <SlidersHorizontal size={17} />
            <span>Make it yours</span>
          </div>
          <label className="select-label">
            <span>Dataset</span>
            <select
              aria-label="Dataset pattern"
              value={dataset}
              onChange={(event) => {
                const next = event.target.value as Dataset;
                setDataset(next);
                replaceInput(generateArray(preferences.size, next));
              }}
            >
              <option value="random">Random</option>
              <option value="reversed">Reversed</option>
              <option value="nearly-sorted">Nearly sorted</option>
              <option value="duplicates">Few unique values</option>
            </select>
          </label>
          <label className="size-control">
            <span>
              Array size <strong>{input.length}</strong>
            </span>
            <input
              type="range"
              aria-label="Array size"
              min="1"
              max="40"
              value={input.length}
              onChange={(event) => {
                const size = Number(event.target.value);
                preferences.update({ size });
                replaceInput(generateArray(size, dataset));
              }}
            />
          </label>
          <button
            className="button secondary shuffle-button"
            onClick={() => replaceInput(generateArray(preferences.size, dataset))}
          >
            <Shuffle size={15} /> New array
          </button>
          <button
            className={`button text-button ${customOpen ? 'selected' : ''}`}
            onClick={() => setCustomOpen((value) => !value)}
            aria-expanded={customOpen}
            aria-controls="custom-array"
          >
            <Braces size={16} /> Custom input
            {customOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        {customOpen && (
          <form
            id="custom-array"
            className="custom-array"
            onSubmit={(event) => {
              event.preventDefault();
              const result = parseArray(customText);
              if (result.error) setError(result.error);
              else if (result.values) {
                setError('');
                preferences.update({ size: result.values.length });
                replaceInput(result.values);
              }
            }}
          >
            <label htmlFor="custom-values">
              Your values <span>1–40 numbers, between −999 and 999</span>
            </label>
            <div>
              <input
                id="custom-values"
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'array-error' : undefined}
              />
              <button className="button primary" type="submit">
                Apply array <ArrowRight size={15} />
              </button>
            </div>
            {error && (
              <p id="array-error" role="alert" className="input-error">
                {error}
              </p>
            )}
          </form>
        )}
      </section>
      <LabPlayer key={`${algorithmId}-${generation}`} algorithmId={algorithmId} input={input} />
      <EducationalPanel algorithm={algorithm} />
    </div>
  );
}

function LabPlayer({ algorithmId, input }: { algorithmId: AlgorithmId; input: readonly number[] }) {
  const algorithm = algorithms[algorithmId];
  const { speed, advanced, update } = usePreferences();
  const frames = useMemo(() => sortAlgorithms[algorithmId](input), [algorithmId, input]);
  const playback = usePlayback(frames.length, speed);
  const frame = frames[playback.index];
  const completed = playback.index === playback.last;
  return (
    <div className="lab-grid">
      <section className="panel visualization-panel" aria-label="Interactive sorting visualization">
        <div className="visualization-header">
          <div>
            <span
              className={`status-dot ${playback.playing ? 'running' : completed ? 'complete' : ''}`}
            />
            <h2>Array visualizer</h2>
            <span className="visualizer-status">
              {playback.playing
                ? 'RUNNING'
                : completed
                  ? 'COMPLETE'
                  : playback.index > 0
                    ? 'PAUSED'
                    : 'READY WHEN YOU ARE'}
            </span>
          </div>
          <span className="mono-tag">ASCENDING ↑</span>
        </div>
        <div className="stats-row">
          <div>
            <span>ELEMENTS</span>
            <strong>{input.length.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span>COMPARISONS</span>
            <strong data-testid="comparisons">
              {frame.comparisons.toString().padStart(2, '0')}
            </strong>
          </div>
          <div>
            <span>{algorithmId === 'merge' ? 'ARRAY WRITES' : 'SWAPS'}</span>
            <strong data-testid={algorithmId === 'merge' ? 'writes' : 'swaps'}>
              {(algorithmId === 'merge' ? frame.writes : frame.swaps).toString().padStart(2, '0')}
            </strong>
          </div>
          <div className="speed-control">
            <label htmlFor="playback-speed">
              PLAYBACK SPEED <strong>{speed}×</strong>
            </label>
            <input
              id="playback-speed"
              type="range"
              min="0.5"
              max="4"
              step="0.5"
              value={speed}
              onChange={(event) => update({ speed: Number(event.target.value) })}
            />
          </div>
        </div>
        <SortingBars snapshot={frame} speed={speed} buffered={algorithmId === 'merge'} />
        <PlaybackControls {...playback} />
        <div className={`step-insight ${completed ? 'insight-complete' : ''}`}>
          <span className="insight-icon">
            {completed ? <Check size={19} /> : <Sparkles size={19} />}
          </span>
          <div>
            <div className="insight-heading">
              <span className="eyebrow">
                {completed
                  ? 'ORDER FOUND'
                  : frame.operation === 'ready'
                    ? 'LET’S MAKE SENSE OF IT'
                    : `THIS STEP / ${frame.operation.toUpperCase()}`}
              </span>
              <div className="explanation-toggle" aria-label="Explanation level">
                <button
                  aria-pressed={!advanced}
                  className={!advanced ? 'active' : ''}
                  onClick={() => update({ advanced: false })}
                >
                  Beginner
                </button>
                <button
                  aria-pressed={advanced}
                  className={advanced ? 'active' : ''}
                  onClick={() => update({ advanced: true })}
                >
                  Advanced
                </button>
              </div>
            </div>
            <p data-testid="step-explanation" aria-live={playback.playing ? 'off' : 'polite'}>
              {advanced ? frame.advanced : frame.explanation}
            </p>
          </div>
        </div>
        <details className="array-readout">
          <summary>
            Read current values <ChevronDown size={12} />
          </summary>
          <output data-testid="array-values">
            [{frame.items.map((item) => item.value).join(', ')}]
          </output>
        </details>
      </section>
      <PseudocodePanel algorithm={algorithm} snapshot={frame} />
    </div>
  );
}
