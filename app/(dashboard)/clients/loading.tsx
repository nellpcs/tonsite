import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col gap-6 px-6 py-8 lg:px-10">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-full" />
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-t border-gray-100 px-6 py-4">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
