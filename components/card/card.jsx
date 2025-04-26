import React from "react";
import ProgressBar from "../progress-bar/progress-bar";
import Link from "next/link";
const Card = () => {
  return (
    <Link href="/fund/hello-world-cuong" className="flex flex-col">
      <div className="relative rounded-lg flex-1 overflow-hidden">
        <img
          src="https://images.gofundme.com/yRXw9DofCq8pcyBwVH57E6QRqUc=/720x405/https://d2g8igdw686xgo.cloudfront.net/89844979_1743182735176991_r.png"
          className="object-cover w-full h-full"
        />
        <span className="absolute left-2 bottom-2 px-4 py-1 bg-slate-900 bg-opacity-80 text-white rounded-full">
          1k donations
        </span>
      </div>
      <div>
        <h3 className="font-semibold leading-none p-2 mb-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h3>
        <ProgressBar value={123000} max={200000} />
      </div>
    </Link>
  );
};

export default Card;
