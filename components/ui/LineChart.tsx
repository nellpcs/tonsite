import { cn } from "@/lib/utils";

export interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartPoint[];
  className?: string;
  valueFormatter?: (value: number) => string;
}

const WIDTH = 640;
const HEIGHT = 260;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

export default function LineChart({
  data,
  className,
  valueFormatter,
}: LineChartProps) {
  if (data.length < 2) return null;

  const chartWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const niceMax = maxValue === 0 ? 1 : Math.ceil(maxValue / 5) * 5;
  const yMax = niceMax * 1.1;

  const format = valueFormatter ?? ((value: number) => value.toLocaleString("fr-FR"));

  function xFor(index: number) {
    return PADDING_LEFT + (index / (data.length - 1)) * chartWidth;
  }
  function yFor(value: number) {
    return PADDING_TOP + chartHeight - (value / yMax) * chartHeight;
  }

  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");
  const baseline = PADDING_TOP + chartHeight;
  const areaPoints = `${xFor(0)},${baseline} ${linePoints} ${xFor(data.length - 1)},${baseline}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) =>
    Math.round(yMax * fraction)
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn("h-64 w-full", className)}
      role="img"
      aria-label="Graphique d'évolution sur la période"
    >
      <defs>
        <linearGradient id="lineChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8C63FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8C63FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => {
        const y = yFor(tick);
        return (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              y1={y}
              x2={WIDTH - PADDING_RIGHT}
              y2={y}
              className="stroke-gray-100"
              strokeWidth={1}
            />
            <text
              x={PADDING_LEFT - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-gray-400 text-[10px]"
            >
              {format(tick)}
            </text>
          </g>
        );
      })}

      <polygon points={areaPoints} fill="url(#lineChartFill)" />

      <polyline
        points={linePoints}
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />

      {data.map((d, i) => (
        <circle
          key={d.label}
          cx={xFor(i)}
          cy={yFor(d.value)}
          r={3.5}
          strokeWidth={2}
          className="fill-white stroke-primary"
        />
      ))}

      {data.map((d, i) => (
        <text
          key={d.label}
          x={xFor(i)}
          y={HEIGHT - PADDING_BOTTOM + 20}
          textAnchor="middle"
          className="fill-gray-500 text-[10px]"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
