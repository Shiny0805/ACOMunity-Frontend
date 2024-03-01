import React, { useState, useEffect } from "react";
import { getBalance } from "utils/balanceHalper";
import { ImSpinner9 } from "react-icons/im";
import { useEthersProvider } from "hooks/useEthers";
import { useAccount } from "wagmi";
import { toFixed } from "utils/customHelpers";
export default function TokenItem({ token, disabledToken, handleToken }) {
  const provider = useEthersProvider();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetch() {
      setLoading(true);

      const balance = await getBalance(address, token, provider);
      setBalance(balance);
      setLoading(false);
    }
    if (address) fetch();
  }, [address]);


  return (
    <>
      <li
        className={`flex p-2 justify-between items-center border border-secondary transition ease-in-out relative  ${
          token.lpSymbol === disabledToken
            ? "bg-black opacity-40"
            : "hover:bg-black hover:bg-opacity-40"
        }`}
        onClick={(e) => {
          token.lpSymbol !== disabledToken && handleToken(token);
        }}
      >
        <div className="flex items-center">
          {token.isTokenOnly ? (
            <img className="w-8 h-8 rounded-full" src={token?.logoA} alt="" />
          ) : (
            <div className="w-8 h-8 relative ml-2">
              <img
                className="w-8 h-8 rounded-full absolute left-1/2 -translate-x-[80%]"
                src={token?.logoA}
                alt=""
              />{" "}
              <img
                className="w-8 h-8 rounded-full  absolute left-1/2 -translate-x-[30%]"
                src={token?.logoB}
                alt=""
              />
            </div>
          )}

          <div className="block ml-3 py-1">
            <h1 className="text-yellow-main text-base">{token?.lpSymbol}</h1>
            <p className="text-gray-400 text-sm">{token.title}</p>
          </div>
        </div>
        {!loading ? (
          <p className={`text-md text-gray-400`}>{toFixed(balance, 5)}</p>
        ) : (
          <div>
            <ImSpinner9 className="text-gray-500 animate-spin" />
          </div>
        )}
      </li>
    </>
  );
}
