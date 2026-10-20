import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  GitBranch,
  Layers3,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlgorithmArt } from '../components/AlgorithmArt';
import { algorithms, algorithmIds } from '../data/algorithms';
import { usePreferences } from '../hooks/PreferencesProvider';

export function Dashboard() {
  const { recent } = usePreferences();
  return (
    <motion.div
      className="page dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            <span className="tiny-line" /> YOUR ALGORITHM WORKSPACE
          </p>
          <h1>
            Build your intuition<span className="violet-text">.</span>
          </h1>
          <p className="page-subtitle">
            Turn “I’ve seen this before” into “I know how this works.”
          </p>
        </div>
        <span className="release-badge">
          <span className="online-dot" /> Phase 01 <span>/</span> Foundations
        </span>
      </div>
      <section className="dashboard-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Sparkles size={14} /> LESS MEMORIZING. MORE UNDERSTANDING.
          </span>
          <h2 id="hero-title">
            Great ideas start
            <br />
            with small <span>steps.</span>
          </h2>
          <p>
            See the logic. Follow the decisions. Make algorithms
            <br className="desktop-break" /> make sense, one visualization at a time.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/sorting/${recent[0] ?? 'bubble'}`}>
              <Play size={15} fill="currentColor" />{' '}
              {recent.length ? 'Back to the sorting lab' : 'Enter the sorting lab'}
              <ArrowRight size={16} />
            </Link>
            <a className="text-link" href="#algorithms">
              Explore algorithms <ChevronRight size={15} />
            </a>
          </div>
          <div className="hero-footnote">
            <span>
              <Check size={13} /> Go at your pace
            </span>
            <span>
              <Check size={13} /> Every step explained
            </span>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-note">
            <span className="note-icon">
              <Lightbulb size={17} />
            </span>
            <div>
              A little swap.<small>A little more clarity.</small>
            </div>
          </div>
          <div className="hero-terminal">
            <div className="terminal-heading">
              <span className="terminal-dots">
                <i />
                <i />
                <i />
              </span>
              <span>bubble-sort.visualize</span>
              <span className="terminal-indicator">PREVIEW</span>
            </div>
            <div className="hero-chart">
              <AlgorithmArt algorithm="bubble" hero />
            </div>
            <div className="terminal-caption">
              <span className="violet-text">↔</span>
              <span>Compare. Swap. Understand.</span>
              <span className="terminal-cursor" />
            </div>
          </div>
          <span className="orbit-label">complexity → clarity</span>
        </div>
      </section>
      <div className="feature-strip">
        <div>
          <span className="strip-icon violet">
            <BarChart3 size={19} />
          </span>
          <span>
            <strong>3 ways to find order</strong>
            <small>Working, interactive sorting labs</small>
          </span>
        </div>
        <div>
          <span className="strip-icon cyan">
            <RotateCcw size={18} />
          </span>
          <span>
            <strong>Every step, in your control</strong>
            <small>Play, pause, rewind, and explore</small>
          </span>
        </div>
        <div>
          <span className="strip-icon amber">
            <Terminal size={18} />
          </span>
          <span>
            <strong>The logic comes along</strong>
            <small>Live explanations & pseudocode</small>
          </span>
        </div>
      </div>
      <section id="algorithms" className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEARN BY DOING</p>
            <h2>Your sorting toolkit</h2>
          </div>
          <span className="muted text-xs">Three different approaches. One sorted array.</span>
        </div>
        <div className="algorithm-grid">
          {algorithmIds.map((id, index) => {
            const info = algorithms[id];
            return (
              <Link
                to={`/sorting/${id}`}
                className={`algorithm-card accent-${info.accent}`}
                key={id}
              >
                <div className="card-top">
                  <span className="algorithm-number">0{index + 1} / SORTING</span>
                  <span className="level-tag">Beginner</span>
                </div>
                <AlgorithmArt algorithm={id} />
                <div className="algorithm-card-copy">
                  <h3>
                    {info.name}
                    <ArrowUpRight size={19} />
                  </h3>
                  <p>{info.description}</p>
                  <div className="algorithm-card-footer">
                    <span className="complexity-pill">
                      {info.average}
                      <small>avg. time</small>
                    </span>
                    <span>
                      Open lab <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <div className="dashboard-lower">
        <section className="panel recent-panel">
          <div className="section-heading">
            <h2>
              <Clock3 size={17} /> Pick up your curiosity
            </h2>
            <span className="text-xs muted">RECENT LABS</span>
          </div>
          {recent.length ? (
            <div className="recent-list">
              {recent.map((id) => (
                <Link to={`/sorting/${id}`} key={id}>
                  <span className={`recent-icon accent-${algorithms[id].accent}`}>
                    <BarChart3 size={19} />
                  </span>
                  <div>
                    <strong>{algorithms[id].name}</strong>
                    <small>{algorithms[id].tagline}</small>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="recent-empty">
              <span className="empty-orbit">
                <CompassIcon />
              </span>
              <div>
                <strong>Your next discovery starts here.</strong>
                <p>Open a lab and it’ll be waiting here when you return.</p>
                <Link to="/sorting/bubble">
                  Try Bubble Sort <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </section>
        <section className="panel horizon-panel">
          <div className="section-heading">
            <h2>A bigger universe ahead</h2>
            <span className="planned-tag">UP NEXT</span>
          </div>
          <p className="muted text-sm">
            The foundation is sorting. There’s more to explore in later phases.
          </p>
          <div className="horizon-links">
            <Link to="/roadmap/pathfinding">
              <GitBranch size={18} />
              <span>
                Pathfinding<small>Find a way through</small>
              </span>
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/roadmap/structures">
              <Layers3 size={18} />
              <span>
                Data structures<small>Give your data shape</small>
              </span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle
        cx="24"
        cy="24"
        r="19"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 4"
        opacity=".4"
      />
      <path
        d="m31 17-4 10-10 4 4-10Z"
        stroke="currentColor"
        fill="currentColor"
        fillOpacity=".15"
        strokeWidth="1.5"
      />
    </svg>
  );
}
