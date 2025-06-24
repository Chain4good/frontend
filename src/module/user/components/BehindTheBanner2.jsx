import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ImageWithSkeleton component for handling individual image loading
const ImageWithSkeleton = ({
  src,
  alt,
  className,
  badgeText,
  badgePosition,
  animationClass,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true); // Stop showing skeleton even on error
  }, []);

  // Default fallback image
  const fallbackSrc = "/hero-animals-2.png";

  return (
    <div className={`${animationClass} relative`}>
      {/* Skeleton Loading */}
      {!isLoaded && (
        <div className="relative">
          <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
          {badgeText && (
            <Skeleton
              className={`absolute w-16 h-6 rounded-full ${badgePosition}`}
            />
          )}
        </div>
      )}

      {/* Actual Image */}
      <div
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0 absolute"
        }`}
      >
        <img
          src={hasError ? fallbackSrc : src}
          className={className}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        {badgeText && isLoaded && (
          <Badge className={`absolute ${badgePosition}`} variant="secondary">
            {badgeText}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Mobile ImageWithSkeleton component for smaller images
const MobileImageWithSkeleton = ({ src, alt, animationClass }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  const fallbackSrc = "/hero-animals-2.png";

  return (
    <div className="relative">
      {/* Skeleton Loading */}
      {!isLoaded && <Skeleton className="w-[80px] h-[80px] rounded-lg" />}

      {/* Actual Image */}
      <img
        src={hasError ? fallbackSrc : src}
        className={`${animationClass} w-[80px] h-[80px] transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0 absolute"
        }`}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

const BehindTheBanner2 = ({ campaigns }) => {
  // Helper function to safely get campaign data
  const getCampaignData = (index) => {
    const campaign = campaigns?.data?.[index];
    return {
      imageUrl: campaign?.images?.[0]?.url || "/hero-animals-2.png",
      categoryName: campaign?.category?.name || "Danh mục",
    };
  };

  // Loading state for overall campaigns data
  const isLoadingCampaigns = !campaigns?.data || campaigns.data.length === 0;

  return (
    <>
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-gray-200 md:h-[1300px] md:w-[1300px]">
          <div className="h-[300px] w-[300px] rounded-full border border-dashed md:h-[600px] md:w-[600px]"></div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="-z-20 -space-y-80 hidden md:flex flex-col items-center py-32 justify-between text-9xl top-0 left-0 right-0 bottom-0 absolute">
        {/* First row */}
        <div className="flex gap-[600px]">
          {isLoadingCampaigns ? (
            <>
              <div className="animate-gentleFloat3 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute top-3 -right-8 w-16 h-6 rounded-full" />
              </div>
              <div className="animate-gentleFloat1 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute bottom-3 -left-8 w-16 h-6 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <ImageWithSkeleton
                src={getCampaignData(0).imageUrl}
                alt="Campaign 1"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(0).categoryName}
                badgePosition="top-3 -right-8"
                animationClass="animate-gentleFloat3"
              />
              <ImageWithSkeleton
                src={getCampaignData(1).imageUrl}
                alt="Campaign 2"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(1).categoryName}
                badgePosition="bottom-3 -left-8"
                animationClass="animate-gentleFloat1"
              />
            </>
          )}
        </div>

        {/* Second row */}
        <div className="flex gap-[900px]">
          {isLoadingCampaigns ? (
            <>
              <div className="animate-gentleFloat2 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute top-3 -left-8 w-16 h-6 rounded-full" />
              </div>
              <div className="animate-gentleFloat3 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute bottom-3 -right-8 w-16 h-6 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <ImageWithSkeleton
                src={getCampaignData(2).imageUrl}
                alt="Campaign 3"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(2).categoryName}
                badgePosition="top-3 -left-8"
                animationClass="animate-gentleFloat2"
              />
              <ImageWithSkeleton
                src={getCampaignData(3).imageUrl}
                alt="Campaign 4"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(3).categoryName}
                badgePosition="bottom-3 -right-8"
                animationClass="animate-gentleFloat3"
              />
            </>
          )}
        </div>

        {/* Third row */}
        <div className="flex gap-[500px]">
          {isLoadingCampaigns ? (
            <>
              <div className="animate-gentleFloat1 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute -top-8 left-3 w-16 h-6 rounded-full" />
              </div>
              <div className="animate-gentleFloat2 relative">
                <Skeleton className="w-[180px] h-[180px] rounded-full border-[8px] border-muted" />
                <Skeleton className="absolute bottom-8 -right-3 w-16 h-6 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <ImageWithSkeleton
                src={getCampaignData(4).imageUrl}
                alt="Campaign 5"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(4).categoryName}
                badgePosition="-top-8 left-3"
                animationClass="animate-gentleFloat1"
              />
              <ImageWithSkeleton
                src={getCampaignData(5).imageUrl}
                alt="Campaign 6"
                className="w-[180px] h-[180px] border-primary rounded-full border-[8px] object-cover"
                badgeText={getCampaignData(5).categoryName}
                badgePosition="bottom-8 -right-3"
                animationClass="animate-gentleFloat2"
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="-z-20 blur-2xl flex md:hidden gap-6 flex-col items-center justify-center text-9xl top-0 left-0 right-0 bottom-0 absolute">
        <div className="flex gap-20">
          <MobileImageWithSkeleton
            src="/hero-animals-2.png"
            alt="Hero animals"
            animationClass="animate-gentleFloat"
          />
          <MobileImageWithSkeleton
            src="/hero-business-1.png"
            alt="Hero business"
            animationClass="animate-gentleFloat3"
          />
        </div>
        <div className="flex gap-32">
          <MobileImageWithSkeleton
            src="/hero-education-1.png"
            alt="Hero education 1"
            animationClass="animate-gentleFloat2"
          />
          <MobileImageWithSkeleton
            src="/hero-business-4.png"
            alt="Hero business 4"
            animationClass="animate-gentleFloat3"
          />
        </div>
        <div className="flex gap-20">
          <MobileImageWithSkeleton
            src="/hero-education-2.png"
            alt="Hero education 2"
            animationClass="animate-gentleFloat2"
          />
          <MobileImageWithSkeleton
            src="/hero-education-3.png"
            alt="Hero education 3"
            animationClass="animate-gentleFloat"
          />
        </div>
      </div>
    </>
  );
};

export default BehindTheBanner2;
