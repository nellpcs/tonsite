import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col gap-6 px-4 py-8 md:px-6 lg:px-10">
      <Skeleton className="h-8 w-24" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </main>
  );
}
