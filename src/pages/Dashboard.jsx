import React, { useContext, useEffect, useMemo, useState } from "react";
import Navbar from "../components/navbar";
import TopMovers from "@/components/dash/Gainers";
import GlobalStats from "@/components/dash/marketMetrics";
import MarketOverviewChart from "../components/dash/marketoverview"
import TrendingCoins from "@/components/dash/trending";
import Risk from "../components/dash/risk"
import { UserContext } from "@/context/main";
import { getchartData, getMarketreview, getTopMovers, getTopRakers, GettrendingCoins } from "@/utils/fetchdata";
import LoadingScreen from "@/components/Loading";
import { useNavigate } from "react-router-dom";
export default function dashboard() {
  const [loading, setLoading] = useState(false);
    let data;
    const {TopMarketData, setTopMarketData, settrendingCoins,btc, setgainCoins ,gainCoins,setbtc,setmarketreview,trendingCoins,marketreview} = useContext(UserContext)
    const navigate=useNavigate();
    useEffect(() => {
      const fetchtrend = async () => {
        setLoading(true);
     if(gainCoins.length == 0){
        data = await getTopMovers()
        setgainCoins(data)
      }
      setLoading(false);
      if(btc.prices.length == 0){
          data=await getchartData("bitcoin");
          setbtc(data)
      }
      if(trendingCoins.length == 0) {
        data = await GettrendingCoins()
        settrendingCoins(data)
      }
      if(Object.keys(marketreview).length === 0){
        data=await getMarketreview()
        setmarketreview(data)
       } if(TopMarketData.length === 0){
        data = await getTopRakers(10);
        setTopMarketData(data);
       }
       }
     fetchtrend()
    }, [])
    if(loading) return <LoadingScreen/>

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-spaceGrotesk text-white">
      <Navbar />
      <GlobalStats/>
      <div className="px-10 py-5 gap-1">
      <h1 className="text-3xl tracking-tight text-gray-200 font-bold">Market Overview</h1>
      <p className="text-gray-400 py-1"> Stay ahead with real-time insights into the crypto market. Track top performers, analyze trends, and make well informed decisions.</p>
      </div>
  
      <TopMovers/>
      <MarketOverviewChart/>
      <div className="px-6 ">
      <h2 className="text-xl font-semibold mb-2">Risk Assessment</h2>
      <div className="flex justify-between gap-4">
        <p className="text-gray-400 mb-4">Assess the risk levels of various assets based on market volatility, trading volume, and historical performance.</p>
        <span className="text-purple-300 hover:text-purple-400 hover:underline hover:cursor-pointer" onClick={()=>navigate("/Markets/")}>View more</span>
      </div>
      </div>
      <Risk allAssets={TopMarketData}/>
      <TrendingCoins coins={trendingCoins}/>
    </div>
  );
}