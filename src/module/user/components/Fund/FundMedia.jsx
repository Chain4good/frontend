import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import FundCampaignStatus from "../FundCampaignStatus";

const FundMedia = ({ cover, campaignStatus, onImageClick }) => {
  const renderMedia = (cover) => {
    if (!cover) return null;

    if (cover.type === "VIDEO") {
      return <VideoPlayer src={cover.url} />;
    }

    return (
      <img
        className="rounded-lg shadow-md w-full h-96 object-cover"
        src={cover.url}
        onClick={() => onImageClick(cover.url)}
        alt="Campaign cover"
      />
    );
  };

  return (
    <div className="relative">
      {renderMedia(cover)}
      {campaignStatus && (
        <div className="absolute top-4 left-4">
          <FundCampaignStatus status={campaignStatus} />
        </div>
      )}
    </div>
  );
};

export default FundMedia;
