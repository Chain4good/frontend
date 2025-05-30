import React from "react";

const CircleProgress = ({ progress }) => {
  const radius = 25; // Reduced from 42
  const center = 30; // Reduced from 50

  return (
    <svg className="w-full h-full" viewBox="0 0 60 60">
      {" "}
      {/* Reduced from 100x100 */}
      {/* Background circle */}
      <circle
        className="text-muted stroke-current"
        strokeWidth="6" // Reduced from 8
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      {/* Progress circle */}
      <circle
        className="text-primary stroke-current"
        strokeWidth="6" // Reduced from 8
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
        style={{
          strokeDasharray: `${2 * Math.PI * radius}`,
          strokeDashoffset: `${2 * Math.PI * radius * (1 - progress / 100)}`,
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
      {/* Percentage text */}
      <text
        x={center}
        y={center}
        className="text-xs font-bold" // Reduced from text-base
        dominantBaseline="middle"
        textAnchor="middle"
        fill="currentColor"
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

export default CircleProgress;
