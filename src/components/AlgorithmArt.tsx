import type { AlgorithmId } from '../types/algorithm';

const shapes = {
  bubble: [28, 52, 38, 72, 57, 86, 65, 100],
  selection: [22, 34, 45, 60, 90, 68, 100, 80],
  insertion: [22, 35, 48, 60, 74, 52, 90, 100],
};

export function AlgorithmArt({
  algorithm,
  hero = false,
}: {
  algorithm: AlgorithmId;
  hero?: boolean;
}) {
  return (
    <svg
      className={`algorithm-art ${hero ? 'hero-art' : ''}`}
      viewBox="0 0 280 140"
      fill="none"
      aria-hidden="true"
    >
      {[30, 60, 90, 120].map((y) => (
        <path key={y} d={`M0 ${y}H280`} stroke="currentColor" opacity=".08" strokeDasharray="3 5" />
      ))}
      {shapes[algorithm].map((height, i) => (
        <g key={i}>
          <rect
            x={i * 33 + 9}
            y={120 - height}
            width="22"
            height={height}
            rx="4"
            fill="currentColor"
            opacity={i === 3 || i === 4 ? 1 : 0.18 + i * 0.05}
          />
          {hero && (
            <text
              x={i * 33 + 20}
              y="135"
              textAnchor="middle"
              fill="currentColor"
              opacity=".5"
              fontSize="8"
              fontFamily="monospace"
            >
              {i}
            </text>
          )}
        </g>
      ))}
      <path
        d="M116 29v-9h33v9m-4-4 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
