import { BookOpen, Check, Lightbulb, Minus, Terminal } from 'lucide-react';
import type { AlgorithmInfo, SortSnapshot } from '../types/algorithm';

export function PseudocodePanel({
  algorithm,
  snapshot,
}: {
  algorithm: AlgorithmInfo;
  snapshot: SortSnapshot;
}) {
  return (
    <section className="panel pseudocode-panel" aria-labelledby="pseudocode-title">
      <div className="panel-heading">
        <h2 id="pseudocode-title">
          <Terminal size={16} /> Follow the logic
        </h2>
        <span className="mono-tag">PSEUDOCODE</span>
      </div>
      <div className="code-file">
        <span className={`file-dot accent-${algorithm.accent}`} />
        {algorithm.id}-sort.pseudo
      </div>
      <ol className="pseudocode">
        {algorithm.pseudocode.map((line, index) => (
          <li
            key={line}
            className={snapshot.line === index ? 'active-line' : ''}
            aria-current={snapshot.line === index ? 'step' : undefined}
          >
            <span className="line-number" aria-hidden="true">
              {index + 1}
            </span>
            <code>{line}</code>
            {snapshot.line === index && <span className="line-indicator" />}
          </li>
        ))}
      </ol>
      <div className="variables">
        <p className="eyebrow">
          CURRENT POINTERS <span>ZERO-BASED</span>
        </p>
        {Object.keys(snapshot.pointers).length ? (
          <div className="pointer-chips">
            {Object.entries(snapshot.pointers).map(([name, value]) => (
              <span key={name}>
                <code>{name}</code>
                <strong>{value}</strong>
              </span>
            ))}
          </div>
        ) : (
          <p className="muted text-xs">
            {snapshot.operation === 'complete'
              ? 'Execution complete. All values are sorted.'
              : 'Pointers appear as the algorithm advances.'}
          </p>
        )}
        <p className="pointer-help">{algorithm.pointerHelp}</p>
        {algorithm.id === 'merge' && (
          <div className="merge-buffer">
            <p className="eyebrow">TEMPORARY MERGE BUFFER</p>
            <output data-testid="merge-buffer">
              [{snapshot.buffer.map((item) => item.value).join(', ')}]
            </output>
            <p className="pointer-help">
              Values collect here before the complete run is written back.
            </p>
          </div>
        )}
      </div>
      <div className="code-note">
        <Lightbulb size={16} />
        <p>
          The highlighted line is the decision you’re watching. Step back to see why it happened.
        </p>
      </div>
    </section>
  );
}

export function EducationalPanel({ algorithm }: { algorithm: AlgorithmInfo }) {
  return (
    <section className="learning-section" id="learn" aria-labelledby="learn-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BEYOND THE BARS</p>
          <h2 id="learn-title">Understand the idea</h2>
        </div>
        <span className="muted text-xs">{algorithm.name} / field notes</span>
      </div>
      <div className="learning-grid">
        <article className="panel intuition-panel">
          <span className="small-panel-icon">
            <BookOpen size={19} />
          </span>
          <h3>How it works</h3>
          <p>{algorithm.intuition}</p>
          <h4>Where it’s useful</h4>
          <p>{algorithm.application}</p>
        </article>
        <article className="panel tradeoffs-panel">
          <h3>The trade-offs</h3>
          <div className="tradeoff">
            <Check size={17} />
            <p>{algorithm.strength}</p>
          </div>
          <div className="tradeoff tradeoff-caution">
            <Minus size={17} />
            <p>{algorithm.weakness}</p>
          </div>
          <div className="stability-note">
            <span className="mono-tag">STABILITY</span>
            <p>
              {algorithm.stable
                ? 'Equal values keep their original relative order.'
                : 'Equal values may change their relative order.'}
            </p>
          </div>
        </article>
        <article className="panel complexity-panel">
          <h3>Cost of finding order</h3>
          <dl>
            <div>
              <dt>Best case</dt>
              <dd>{algorithm.best}</dd>
            </div>
            <div>
              <dt>Average case</dt>
              <dd>{algorithm.average}</dd>
            </div>
            <div>
              <dt>Worst case</dt>
              <dd>{algorithm.worst}</dd>
            </div>
            <div>
              <dt>Auxiliary space</dt>
              <dd>{algorithm.space}</dd>
            </div>
          </dl>
          {algorithm.complexityNote && <p>{algorithm.complexityNote}</p>}
          <p>
            Algorithm space excludes the visualizer’s stored snapshots. Playback speed is a learning
            control, not a benchmark.
          </p>
        </article>
      </div>
    </section>
  );
}
