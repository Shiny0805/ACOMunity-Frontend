import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function index({ children }) {
  return (
    <>
      <div>
        <Header />
        <div>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
