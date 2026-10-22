import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { algorithmIds, algorithms } from '../data/algorithms';

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  const filtered = algorithmIds.filter((id) =>
    algorithms[id].name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <dialog ref={ref} onClose={onClose} className="search-dialog" aria-labelledby="search-title">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 id="search-title">Find your next algorithm</h2>
        <button className="icon-button" aria-label="Close search" onClick={onClose}>
          <X size={19} />
        </button>
      </div>
      <label className="search-field">
        <Search size={18} />
        <input
          autoFocus
          type="search"
          placeholder="Search sorting algorithms…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search algorithms"
        />
      </label>
      <div className="search-results">
        {filtered.map((id) => (
          <Link to={`/sorting/${id}`} className="search-result" key={id} onClick={onClose}>
            <span>
              <strong>{algorithms[id].name}</strong>
              <small>{algorithms[id].tagline}</small>
            </span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <p className="muted py-5">No matching algorithms. Try “merge”, “quick”, or “heap”.</p>
      )}
      <p className="text-xs muted mt-4">{algorithmIds.length} working sorting labs.</p>
    </dialog>
  );
}
