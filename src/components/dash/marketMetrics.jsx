import { UserContext } from "@/context/main";
import React, {  useContext} from "react";

const GlobalStats = () => {

  const {marketreview}=useContext(UserContext);

  const formatNumber = (num) => {
    return num >= 1e12
      ? `$${(num / 1e12).toFixed(2)}T`
      : num >= 1e9
      ? `$${(num / 1e9).toFixed(2)}B`
      : `$${num.toLocaleString()}`;
  };

  return (
    <div className="flex justify-evenly  p-4  text-white rounded-xl shadow-lg">
       <div className="hidden md:flex flex-col items-center">
        <span className="text-sm text-gray-400">Active Crypto</span>
        <span className="text-xl font-semibold ">{marketreview[0]?.activeCrypto||0}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">Market Cap</span>
        <span className="text-xl font-semibold">{formatNumber(marketreview[0]?.totalMarketCapUsd||0)}</span>
      </div>
      <div className="hidden md:flex flex-col items-center">
        <span className="text-sm text-gray-400">Markets Active</span>
        <span className="text-xl font-semibold">{marketreview[0]?.marketsCirculating||0}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">Total Traded Today</span>
        <span className="text-xl font-semibold">{formatNumber(marketreview[0]?.totalVol||0)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">BTC Dominance</span>
        <span className="text-xl font-semibold">{(marketreview[0]?.btcCapPercentage||0).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default GlobalStats;
