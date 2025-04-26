const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2 relative">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-black font-semibold">
        €{value.toLocaleString()} raised
      </p>
    </div>
  );
};

export default ProgressBar;
