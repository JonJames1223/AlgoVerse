import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Braces,
  ChevronRight,
  Command,
  Compass,
  FlaskConical,
  GitBranch,
  Layers3,
  LayoutDashboard,
  Menu,
  Search,
  Swords,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { SearchDialog } from '../components/SearchDialog';
import { usePreferences } from '../hooks/PreferencesProvider';

const planned = [
  { to: '/roadmap/pathfinding', label: 'Pathfinding', icon: GitBranch, phase: '03' },
  { to: '/roadmap/structures', label: 'Data structures', icon: Layers3, phase: '05' },
  { to: '/roadmap/battle', label: 'Algorithm battle', icon: Swords, phase: '02' },
  { to: '/roadmap/practice', label: 'Practice mode', icon: Braces, phase: '04' },
  { to: '/roadmap/progress', label: 'Learning progress', icon: Activity, phase: '04' },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { recent } = usePreferences();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const section = pathname.startsWith('/sorting')
    ? 'Sorting lab'
    : pathname.startsWith('/roadmap')
      ? 'What’s next'
      : 'Dashboard';
  useEffect(() => {
    document.title = `${section} · AlgoVerse`;
  }, [section]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">
            <span /> <span /> <span />
          </span>
          <span>
            Algo<span className="brand-light">Verse</span>
            <small>MAKE THE ABSTRACT CLICK.</small>
          </span>
        </Link>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-switch">
          <span className="workspace-icon">
            <FlaskConical size={17} />
          </span>
          <span>
            Personal workspace<small>Your curiosity, your pace</small>
          </span>
          <span className="online-dot" />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav aria-label="Main navigation" onClick={() => setMobileOpen(false)}>
          <NavLink to="/" end className="nav-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/sorting/bubble"
            className={() => `nav-link ${pathname.startsWith('/sorting') ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Sorting algorithms</span>
            <span className="nav-count">3</span>
          </NavLink>
          <div className="nav-caption mt-8">
            ON THE HORIZON <span>PHASE</span>
          </div>
          {planned.map(({ to, label, icon: Icon, phase }) => (
            <NavLink to={to} key={to} className="nav-link planned">
              <Icon size={18} />
              <span>{label}</span>
              <small>{phase}</small>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="journey-card">
            <span className="journey-icon">
              <Compass size={19} />
            </span>
            <strong>Start with understanding.</strong>
            <p>
              One algorithm. One step.
              <br />
              One lightbulb moment.
            </p>
            <Link to="/sorting/bubble">
              Open your first lab <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="local-status">
            <span className="online-dot" />
            <span>All learning happens locally</span>
          </div>
          <div className="profile">
            <span className="profile-avatar">Y</span>
            <span>
              Your workspace<small>{recent.length} of 3 sorting labs explored</small>
            </span>
            <span className="version">v0.1</span>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-home">Workspace</span>
            <ChevronRight size={13} />
            <span>{section}</span>
          </div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)}>
              <Search size={15} />
              <span>Find an algorithm</span>
              <kbd>
                <Command size={11} /> K
              </kbd>
            </button>
            <Link to="/sorting/bubble#learn" className="guide-link">
              <BookOpen size={16} />
              <span>Learning guide</span>
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>
            <span className="online-dot" /> Foundation release
          </span>
          <span>Built for the way you think.</span>
        </footer>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
