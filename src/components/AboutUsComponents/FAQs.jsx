import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "uikit";

const FAQsData = [
    {
        title: '1. What is ACOMUnity`s mission?',
        answer: 'ACOMUnity aims to transform the way freelancing and outsourcing operate, offering a decentralized, transparent, and collaborative ecosystem.'
    },
    {
        title: '2. How does the payment system work?',
        answer: 'Freelancers receive payments in AGEMS Tokens through smart contracts, ensuring immediate and secure transactions.'
    },
    {
        title: '3. Can businesses trust the outsourcing solutions?',
        answer: 'Yes, ACOMUnity ensures a vetted pool of freelancers, and transactions are secured through AGEMS Tokens and blockchain technology.'
    },
    {
        title: '4. How do I get started as a freelancer?',
        answer: 'Simply sign up, create a profile highlighting your skills, and start browsing tasks. ACOMUnity is your gateway to global opportunities.'
    },
    {
        title: '5. Is AGEMS Token tradeable outside the platform?',
        answer: 'Yes, AGEMS Tokens are tradeable within the ACOM.Finance ecosystem, offering flexibility and liquidity to users.'
    },
    {
        title: '6. How does ACOMUnity ensure the quality of freelancers?',
        answer: 'ACOMUnity implements a comprehensive vetting process, considering skills, experience, and community ratings. Our decentralized reputation system ensures transparency and reliability.'
    },
    {
        title: '7. What sets AGEMS Token apart from traditional payment methods?',
        answer: 'AGEMS Token leverages blockchain technology, ensureing secure, borderless, and transparent transactions. It eliminates intermediaries, providing faster and more cost-effective payments.'
    },
    {
        title: '8. Are there fees associated with using ACOMUnity?',
        answer: 'ACOMUnity maintains a transparent fee structure, primarily associated with the use of smart contracts and blockchain transactions. Detailed information on fees is available in our Terms of Service.'
    },
    {
        title: '9. How does the community forum benefit users?',
        answer: 'The community forum is a space for networking, mentorship, and collaboration. Users can seek advice, share experiences, and valuable connections within the ACOMUnity ecosystem.'
    },
    {
        title: '10. Can businesses post custom projects for freelancers?',
        answer: 'Absolutely! ACOMUnity facilitates businesses in posting custom projects. Our platform allows detailed project descriptions, ensuring freelancers can find projects aligned with their expertise.'
    },
    {
        title: '11. What happens in case of disputes between freelancers and businesses?',
        answer: 'ACOMUnity employs smart contracts and a decentralized arbitration system to address disputes. Our aim is to ensure fair and transparent resolution for all parties involved.'
    },
    {
        title: '12. How can users convert AGEMS Tokens to other cryptocurrencies?',
        answer: 'Users can leverage the AGEMS Token`s tradeability within the ACOM.Finance ecosystem to convert them to other cryptocurrencies seamlessly.'
    },
    {
        title: '13. Is ACOMUnity available globally?',
        answer: 'Yes, ACOMUnity is a global platform, fostering collaboration and connecting freelancers and businesses from around the world.'
    },
    {
        title: '14. How does ACOMUnity protect user privacy and data?',
        answer: 'We prioritize user privacy and data security. ACOMUnity adheres to strict data protection measures, ensuring user information is handled with utmost confidentiality and care.'
    },
    {
        title: '15. Can I use ACOMUnity on mobile devices?',
        answer: 'Absolutely! ACOMUnity is designed to be accessible on various devices, including mobile phones. Enjoy the flexibility of managing tasks and engaging with the community on the go.'
    }
]
  
  export default function FAQs() {

    return (
    <div class='container m-auto mb-20'>
        <div class='text-4xl text-center p-10'>
            FAQs
        </div>
        <div className="flex justify-center w-full">
            <div class='w-full rounded-2xl bg-white p-2'>

                {
                    FAQsData.map((data, index)=> (
                        <Disclosure key={index}>
                            {({ open }) => (
                            <>
                                <Disclosure.Button class='flex w-full mb-1 justify-between border border-black rounded-lg bg-purple-100 px-4 py-2 text-left text-2xl font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75'>
                                <span>
                                    {data.title}
                                </span>
                                <ChevronUpIcon
                                    className={`${
                                    open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-purple-500`}
                                />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                                    {data.answer}
                                </Disclosure.Panel>
                            </>
                            )}
                        </Disclosure>
                    ))
                }

            </div>
        </div>
    </div>
    );
  }
  