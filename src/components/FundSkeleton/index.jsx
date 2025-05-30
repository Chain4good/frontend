import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-context-menu";

// Add this component before the main Fund component
const FundSkeleton = () => {
  return (
    <div className="container py-6 md:py-10 px-4 md:px-6">
      {/* Title Skeleton */}
      <Skeleton className="h-8 md:h-10 w-3/4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-2">
          {/* Main Image Skeleton */}
          <Skeleton className="w-full h-96 rounded-lg" />

          {/* User Info Skeleton */}
          <div className="flex gap-3 md:gap-4 items-center mt-4 pb-4">
            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <Separator />

          {/* Description Skeleton */}
          <div className="space-y-2 mt-4 md:mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Separator className="my-6 md:my-8" />

          {/* Image Gallery Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>

          <Separator className="my-6 md:my-8" />

          {/* Comments Section Skeleton */}
          <div className="mt-6 md:mt-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fund Box Skeleton */}
        <div className="col-span-1 order-first md:order-none mb-4 md:mb-0">
          <div className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundSkeleton;
