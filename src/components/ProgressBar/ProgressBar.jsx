const ProgressBar = ({ value, max, tokenSymbol }) => {
  const percentage = (value / max) * 100 > 100 ? 100 : (value / max) * 100;
  console.log(tokenSymbol);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2 relative">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <p className=" text-black font-semibold">
          {percentage === 100
            ? "Đã hoàn thành"
            : `${value.toLocaleString()} ${tokenSymbol}`}
        </p>
        <p>
          <span className="text-gray-500">
            {max.toLocaleString()} {tokenSymbol}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
