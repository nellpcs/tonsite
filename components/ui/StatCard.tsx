import { cn } from "@/lib/utils";
import Card from "./Card";
import Sparkline from "./Sparkline";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  sparklineData?: number[];
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  sparklineData,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              isPositive
                ? "bg-accent/10 text-green-700"
                : "bg-red-50 text-red-600"
            )}
          >
            <span aria-hidden="true">{isPositive ? "▲" : "▼"}</span>
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
      {sparklineData && (
        <Sparkline
          data={sparklineData}
          strokeClassName={isPositive ? "stroke-accent" : "stroke-red-500"}
        />
      )}
    </Card>
  );
}
