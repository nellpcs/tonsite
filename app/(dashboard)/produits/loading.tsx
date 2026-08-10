import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <Skeleton className="h-8 w-48" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </main>
  );
}
