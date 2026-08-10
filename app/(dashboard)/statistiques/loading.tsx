import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-56" />
      </div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </section>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </main>
  );
}
