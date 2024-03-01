import React from "react";

export default function Loading({ title = "" }) {
  return (
    <div className="flex justify-center items-center">
      <img
        src="/assets/loading.svg"
        alt="Loading..."
        className="w-[30px] h-[30px]"
      />
      {title}
    </div>
  );
}
