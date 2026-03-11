import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container px-4 py-20 space-y-12">
            {/* Hero Skeleton */}
            <div className="max-w-3xl mx-auto space-y-6 text-center">
                <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-2/3 mx-auto rounded-2xl" />
                <div className="flex justify-center gap-4 pt-4">
                    <Skeleton className="h-14 w-40 rounded-full" />
                    <Skeleton className="h-14 w-40 rounded-full" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="max-w-4xl mx-auto pt-20 space-y-8">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
