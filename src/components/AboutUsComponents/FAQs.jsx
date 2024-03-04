import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "uikit";
  
  export default function FAQs() {

    return (
    <div class='container m-auto'>
        <div class='text-4xl text-center p-10'>
            FAQs
        </div>
        <div className="flex justify-center w-full">
            <div class='w-full rounded-2xl bg-white p-2'>
                <Disclosure>
                    {({ open }) => (
                    <>
                        <Disclosure.Button class='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-2xl font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75'>
                        <span>
                            What is your refund policy?
                        </span>
                        <ChevronUpIcon
                            className={`${
                            open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-purple-500`}
                        />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                        If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.
                        </Disclosure.Panel>
                    </>
                    )}
                </Disclosure>

                <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                    <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-2xl font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                        <span>
                            Do you offer technical support?
                        </span>
                        <ChevronUpIcon
                            className={`${
                            open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-purple-500`}
                        />
                        </Disclosure.Button>

                        <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                        No.
                        </Disclosure.Panel>
                    </>
                    )}
                </Disclosure>
            </div>
        </div>
    </div>
    );
  }
  