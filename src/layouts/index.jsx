import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function index({ children }) {
  return (
    <div className="">
      <Header />
      <div className="flex w-full justify-center items-center pt-4 min-h-[calc(100vh-70px)] pb-[100px] relative px-1">
        {children}
        <Footer />
      </div>
    </div>
  );
}
