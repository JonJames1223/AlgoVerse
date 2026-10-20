import { motion, useReducedMotion } from 'motion/react';
import type { SortSnapshot } from '../types/algorithm';

export function SortingBars({ snapshot, speed }: { snapshot: SortSnapshot; speed: number }) {
  const reduced = useReducedMotion();
  const values = snapshot.items.map((item) => item.value);
  const low = Math.min(0, ...values);
  const high = Math.max(1, ...values);
  const width = 760;
  const top = 34;
  const chartHeight = 210;
  const unit = chartHeight / (high - low);
  const zero = top + high * unit;
  const slot = (width - 40) / Math.max(values.length, 1);
  const barWidth = Math.max(3, Math.min(40, slot - 7));
  const transition = {
    duration: reduced ? 0 : Math.min(0.24, 0.4 / speed),
    ease: 'easeInOut' as const,
  };
  return (
    <div className="chart-wrap">
      <svg
        className="sorting-chart"
        viewBox={`0 0 ${width} 290`}
        role="img"
        aria-label={`Array: ${values.join(', ')}. ${snapshot.operation}.`}
      >
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="18"
            x2="742"
            y1={top + i * 70}
            y2={top + i * 70}
            stroke="var(--border)"
            strokeDasharray="3 6"
          />
        ))}
        <line x1="18" x2="742" y1={zero} y2={zero} stroke="var(--border-strong)" />
        {snapshot.items.map((item, index) => {
          const active = snapshot.active.includes(index);
          const sorted = snapshot.sorted.includes(index);
          const state = active
            ? snapshot.operation === 'swap'
              ? 'swap'
              : 'compare'
            : sorted
              ? 'sorted'
              : 'idle';
          const x = 20 + slot * index + (slot - barWidth) / 2;
          const y = item.value >= 0 ? zero - item.value * unit : zero;
          const height = Math.max(Math.abs(item.value) * unit, 2);
          const labelY = item.value >= 0 ? y - 9 : y + height + 15;
          return (
            <motion.g
              key={item.id}
              initial={false}
              animate={{ x }}
              transition={transition}
              data-testid={`bar-${item.id}`}
              data-value={item.value}
            >
              <motion.rect
                className={`sort-bar bar-${state}`}
                width={barWidth}
                rx={Math.min(4, barWidth / 3)}
                initial={false}
                animate={{ y, height }}
                transition={transition}
              />
              {values.length <= 24 && (
                <motion.text
                  className={`bar-value value-${state}`}
                  x={barWidth / 2}
                  textAnchor="middle"
                  initial={false}
                  animate={{ y: labelY }}
                  transition={transition}
                >
                  {item.value}
                </motion.text>
              )}
              <text className="bar-index" x={barWidth / 2} y="285" textAnchor="middle">
                {index}
              </text>
              {active && (
                <circle cx={barWidth / 2} cy="268" r="2.5" className={`marker-${state}`} />
              )}
            </motion.g>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span>
          <i className="legend-idle" />
          Unsorted
        </span>
        <span>
          <i className="legend-compare" />
          Comparing / selected
        </span>
        <span>
          <i className="legend-swap" />
          Swapping
        </span>
        <span>
          <i className="legend-sorted" />
          Sorted region
        </span>
      </div>
    </div>
  );
}
