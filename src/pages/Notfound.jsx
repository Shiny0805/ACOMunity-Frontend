import React from "react";

export default function Notfound() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-5xl text-white font-bold mb-8 animate-pulse">
        Page Not Found?
      </h1>
      <p className="text-white text-lg mb-8 text-center">
        Whoops, this is embarassing. <br /> Looks like the page you were looking
        for wasn't found.
      </p>
      <a href="/" className="bg-yellow-main text-black px-6 py-2 rounded-full cursor-pointer hover:bg-hover transition ease-in-out">Back to Home</a>
    </div>
  );
}
