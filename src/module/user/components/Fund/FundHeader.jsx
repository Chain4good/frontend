import { truncate } from "lodash";
import { Link2Icon } from "lucide-react";
import { Link } from "react-router-dom";

const FundHeader = ({ campaign }) => {
  return (
    <Link
      to={`https://sepolia.etherscan.io/tx/${campaign?.txHash}`}
      className="text-2xl md:text-4xl font-semibold pb-4 md:pb-6 flex items-center gap-1"
      target="_blank"
      rel="noopener noreferrer"
      title={campaign?.title}
    >
      {truncate(campaign?.title, { length: 60 })} <Link2Icon />
    </Link>
  );
};

export default FundHeader;
