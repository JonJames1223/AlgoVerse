import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Construction,
  GitBranch,
  Layers3,
  Swords,
  Braces,
  Activity,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const roadmap = {
  battle: {
    name: 'Algorithm battle',
    phase: 2,
    icon: Swords,
    description:
      'Compare sorting algorithms on identical inputs, with independent counters and a clear distinction between computation and animation.',
  },
  pathfinding: {
    name: 'Pathfinding algorithms',
    phase: 3,
    icon: GitBranch,
    description:
      'Explore Dijkstra, A*, BFS, and DFS on interactive grids, with walls, weighted terrain, and step-by-step decisions.',
  },
  practice: {
    name: 'Practice mode',
    phase: 4,
    icon: Braces,
    description:
      'Predict the next operation, check your understanding, and get explanations drawn from real algorithm states.',
  },
  progress: {
    name: 'Learning progress',
    phase: 4,
    icon: Activity,
    description:
      'Track completed lessons, practice answers, and accuracy from your actual interactions. For now, the dashboard remembers the labs you open.',
  },
  structures: {
    name: 'Data structures',
    phase: 5,
    icon: Layers3,
    description:
      'Build your intuition for stacks, queues, linked lists, binary search trees, and min heaps through hands-on operations.',
  },
};

export function Roadmap() {
  const { topic } = useParams();
  const item = topic && topic in roadmap ? roadmap[topic as keyof typeof roadmap] : null;
  if (!item) return <NotFound />;
  const Icon = item.icon;
  return (
    <div className="page roadmap-page">
      <p className="eyebrow">THE NEXT CHAPTER</p>
      <div className="roadmap-icon">
        <Icon size={34} />
      </div>
      <span className="release-badge">
        <Construction size={14} /> Planned for Phase 0{item.phase}
      </span>
      <h1>{item.name}</h1>
      <p className="roadmap-description">{item.description}</p>
      <p className="muted">
        This feature is on the roadmap. The six sorting labs are ready to explore.
      </p>
      <Link to="/sorting/bubble" className="button primary mt-7">
        Explore the sorting lab <ArrowRight size={16} />
      </Link>
      <div className="roadmap-foundation panel">
        <span className="eyebrow">AVAILABLE NOW</span>
        <h2>A strong foundation.</h2>
        <div>
          <span>
            <Check size={16} /> Six sorting algorithms
          </span>
          <span>
            <Check size={16} /> Reversible playback
          </span>
          <span>
            <Check size={16} /> Live explanations
          </span>
        </div>
        <Link to="/">
          Back to your dashboard <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page roadmap-page">
      <p className="eyebrow">404 / UNCHARTED TERRITORY</p>
      <h1>Let’s find your way back.</h1>
      <p className="muted">That page or algorithm isn’t part of this workspace.</p>
      <Link to="/" className="button primary mt-7">
        Back to dashboard <ArrowRight size={16} />
      </Link>
    </div>
  );
}
