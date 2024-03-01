import React, { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import { routes } from "config";
import { WalletConnect } from "components/UI/ConnectButton";

export default function Header() {
  const currentUrl = window.location.pathname;
  const [isMobile, setMobile] = useState(false);

  return (
    <>
      <div className="bg-main-100 shadow shadow-black/30 drop-shadow-md">
        <div className="container mr-auto ml-auto relative">
          <div className="flex justify-between">
            <div className="hidden sm:block logo">
              <a href="/">
                <img src="/assets/logo.png" alt="logo" width={170} height={170} style={{ padding: 10 }} />
              </a>
            </div>
            <div
              className="text-yellow-main ml-2 block sm:hidden mt-[3px]"
              onClick={() => setMobile(!isMobile)}
            >
              <Hamburger />
            </div>

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ul className="nav_list">
              {routes.map((link, key) => (
                  <li
                    className={`list_item ${
                      currentUrl === link.url ? "active" : ""
                    }`}
                    key={key}
                  >
                    {link.dropdownItems ? (
                      <div>
                        <button
                          id="dropdownHoverButton" 
                          data-dropdown-toggle="dropdownHover" 
                          data-dropdown-trigger="hover"
                          class="text-white inline-flex items-center"
                        >
                          {link.name}
                          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                          </svg>  
                        </button>

                        <div id="dropdownHover" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                            {link.dropdownItems.map((dropdownItem, index) => (
                              <li class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <a
                                  key={index}
                                  href={dropdownItem.url}
                                  className={`dropdown-item ${
                                    currentUrl === dropdownItem.url ? "active" : ""
                                  }`}
                                >
                                  {dropdownItem.name}
                                </a>
                              </li>
                          ))}
                          </ul>
                        </div>
                        
                      </div>
                    ) : (
                      <a href={link.url}>{link.name}</a>
                    )}
                    <img src="/assets/hover.png" alt="" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav_action">
              <WalletConnect />
              <div
                className="text-yellow-main ml-2 hidden sm:block lg:hidden"
                onClick={() => setMobile(!isMobile)}
              >
                <Hamburger />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile === true ? (
        <div className="container mr-auto ml-auto">
          <div className="nav_bar mobile_navbar">
            <ul className="nav_list">
              {routes.map((link, key) => (
                <li
                  className={`list_item ${
                    currentUrl === link.url ? "active" : ""
                  }`}
                  key={key}
                >
                  <a href={link.url}>{link.name}</a>
                </li>
              ))}
              <li className={`list_item`}>
                <a
                  href="https://lodgedocs.gitbook.io/3wild-bsc-farm/"
                  target="_blank"
                  className={`p-3`}
                  rel="noopener noreferrer"
                >
                  {" "}
                  Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
