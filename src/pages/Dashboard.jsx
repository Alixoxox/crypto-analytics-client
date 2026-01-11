import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/main";
import LoadingScreen from "@/components/Loading";
import Navbar from "../components/navbar";
import TopMovers from "@/components/dash/Gainers";
import GlobalStats from "@/components/dash/marketMetrics";
import MarketOverviewChart from "../components/dash/marketoverview";
import TrendingCoins from "@/components/dash/trending";
import Risk from "../components/dash/risk";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { gainCoins, btc, trendingCoins, marketreview, TopMarketData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Loading only until context data is ready
  useEffect(() => {
    if (
      gainCoins.length &&
      btc?.prices?.length &&
      trendingCoins.length &&
      Object.keys(marketreview).length &&
      TopMarketData.length
    ) {
      setLoading(false);
    }
  }, [gainCoins, btc, trendingCoins, marketreview, TopMarketData]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-spaceGrotesk text-white">
      <Navbar />
      <GlobalStats />
      <div className="px-10 py-5 gap-1">
        <h1 className="text-3xl tracking-tight text-gray-200 font-bold">Market Overview</h1>
        <p className="text-gray-400 py-1">
          Stay ahead with real-time insights into the crypto market. Track top performers, analyze trends, and make well informed decisions.
        </p>
      </div>
      <TopMovers />
      <MarketOverviewChart />
      <div className="px-6 ">
        <h2 className="text-xl font-semibold mb-2">Risk Assessment</h2>
        <div className="flex justify-between gap-4">
          <p className="text-gray-400 mb-4">
            Assess the risk levels of various assets based on market volatility, trading volume, and historical performance.
          </p>
          <span
            className="text-purple-300 hover:text-purple-400 hover:underline hover:cursor-pointer"
            onClick={() => navigate("/Markets/")}
          >
            View more
          </span>
        </div>
      </div>
      <Risk allAssets={TopMarketData} hide={true} />
      <TrendingCoins coins={trendingCoins} />
    </div>
  );
}
