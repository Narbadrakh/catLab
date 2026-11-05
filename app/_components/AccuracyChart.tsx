import React from "react";

type Props = {
  /** Accuracy in percent (0-100) for each finished round, in order. */
  data: number[];
  totalRounds?: number;
};

export function AccuracyChart({ data, totalRounds = 10 }: Props) {
  const left = 44;
  const right = 290;
  const top = 12;
  const bottom = 100;
  const width = right - left;
  const height = bottom - top;

  const xOf = (round: number) =>
    left + ((round - 1) / Math.max(1, totalRounds - 1)) * width;
  const yOf = (value: number) =>
    bottom - (Math.min(100, Math.max(0, value)) / 100) * height;

  const points = data.map((value, i) => ({ x: xOf(i + 1), y: yOf(value) }));
  const last = points[points.length - 1];

  return (
    <div className="w-full bg-[#f4f6fb] rounded-[12px] p-3">
      <svg
        viewBox="0 0 300 124"
        className="w-full h-auto"
        role="img"
        aria-label="Accuracy per round"
      >
        {/* grid + y axis labels */}
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line
              x1={left}
              x2={right}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke="#dfe4ee"
              strokeWidth={1}
            />
            <text
              x={left - 8}
              y={yOf(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#5d6779"
            >
              {v}%
            </text>
          </g>
        ))}
                {/* x axis labels: round 1, middle round, last round */}
        <text x={xOf(1)} y={118} textAnchor="start" fontSize={10} fill="#5d6779">
          round 1
        </text>
        <text
          x={xOf(Math.floor((1 + totalRounds) / 2))}
          y={118}
          textAnchor="middle"
          fontSize={10}
          fill="#5d6779"
        >
          round {Math.floor((1 + totalRounds) / 2)}
        </text>
        <text
          x={xOf(totalRounds)}
          y={118}
          textAnchor="end"
          fontSize={10}
          fill="#5d6779"
        >
          round {totalRounds}
        </text>

        {/* line */}
        {points.length > 1 && (
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#3b5bdb"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* latest point */}
        {last && <circle cx={last.x} cy={last.y} r={5} fill="#3b5bdb" />}
      </svg>
    </div>
  );
}