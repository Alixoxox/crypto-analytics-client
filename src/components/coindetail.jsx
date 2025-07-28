import React, { useState, useMemo, useEffect, useContext } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis} from "recharts";
import {  Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import Navbar from "../components/navbar"
import { useNavigate, useParams } from "react-router-dom";
import {  getIndividualCoin } from "@/utils/fetchdata";
import { UserContext } from "@/context/main";
import LoadingScreen from "./Loading";
const CoinSnapshot = () => {
const { viewCoin, setviewCoin } = useContext(UserContext);
const { id } = useParams();
const navigate = useNavigate();
const decodedId = decodeURIComponent(id); 

const [loading, setLoading] = useState(true);
const [range, setRange] = useState("all");

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getIndividualCoin(decodedId);
      if (!data || data.error) {
        return navigate("/Overview/");
      }
      setviewCoin(data);
    } catch (err) {
      console.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

// move hook calls OUTSIDE conditional branches
const fullData = useMemo(() => {
  if (!viewCoin?.timestamps || !viewCoin?.prices) return [];
  return viewCoin?.timestamps.map((ts, i) => ({
    date: new Date(ts),
    price: viewCoin?.prices[i],
  })).reverse();
}, [viewCoin]);

const visibleData = useMemo(() => {
  if (range === "all") return fullData;
  const count = range === "30d" ? 30 : 7;
  return fullData.slice(0, count);
}, [range, fullData]);

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

if (loading || !viewCoin?.lastestShot) return <LoadingScreen />;

const coin = viewCoin?.lastestShot;

  return (<div className="bg-[#1a1a1a]">
<Navbar/>
    <Card className="bg-inherit  text-white border-transparent mt-5">
    <CardHeader className="pb-2">
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-4">
      <img src={coin.image} alt={coin.coinId} className="h-20" />
      <div>
        <CardTitle className="text-2xl font-bold capitalize">
          {decodedId}
        </CardTitle>
        <CardDescription>
          Market Rank #{coin.market_cap_rank}
        </CardDescription>
      </div>
    </div>

    <Button
      variant="outline"
      className="text-white border-white hover:bg-white/10"
      onClick={() => navigate(`/Compare/${decodedId}`)} 
    >
      Compare
    </Button>
  </div>
</CardHeader>


      <CardContent className="space-y-6">
        {/* Live Price */}
        <div>
          <h2 className="text-4xl font-semibold">
            ${coin.current_price}
          </h2>
          <p
            className={`mt-1 ${
              coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
           Past 24h: {coin.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>

        {/* Chart Filter Buttons */}
        <div className="flex gap-2">
          {["7d", "30d", "all"].map((opt) => (
            <Button
              key={opt}
              variant={range === opt ? "default" : "outline"}
              onClick={() => setRange(opt)}
              className="capitalize"
            >
              {opt === "7d" ? "7 Days" : opt === "30d" ? "1 Month" : "All Time"}
            </Button>
          ))}
        </div>

        {/* Area Chart */}
        <ChartContainer
          className="w-full h-[280px] capitalize"
          config={{
            price: {
              label: `${coin.coinId} Price`,
              color: "var(--chart-1)",
            },
          }}
        >
          <AreaChart data={visibleData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) =>
                    `Time: ${label.toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}`
                  }
                  valueFormatter={(value) =>
                    `$${Number(value).toLocaleString()}`
                  }
                />
              }
            />
            <Area
              dataKey="price"
              type="monotone"
              fill="url(#fillPrice)"
              stroke="purple"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 mt-6">
  {/* Market Cap */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-400 text-sm font-medium">Market Cap</p>
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
    <p className="text-white text-lg font-semibold">${coin.market_cap.toLocaleString()}</p>
    <p className="text-xs text-gray-500 mt-1">Rank #{coin.market_cap_rank}</p>
  </div>

  {/* 24h Volume */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-400 text-sm font-medium">24h Volume</p>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <p className="text-white text-lg font-semibold">${coin.total_volume.toLocaleString()}</p>
    <p className="text-xs text-gray-500 mt-1">Trading volume</p>
  </div>

  {/* Price Range */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-400 text-sm font-medium">24h Range</p>
      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-red-400">Low:</span>
        <span className="text-white font-medium">${coin.low_24h.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-green-400">High:</span>
        <span className="text-white font-medium">${coin.high_24h.toLocaleString()}</span>
      </div>
    </div>
  </div>

  {/* All Time High */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-400 text-sm font-medium">All Time High</p>
      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
    </div>
    <p className="text-white text-lg font-semibold">${coin.ath.toLocaleString()}</p>
    <p className={`text-xs mt-1 ${coin.ath_change_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {coin.ath_change_percentage >= 0 ? '+' : ''}{coin.ath_change_percentage.toFixed(2)}% from ATH
    </p>
  </div>

  {/* Circulating Supply */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2 ">
      <p className="text-gray-400 text-sm font-medium">Circulating Supply</p>
      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
    </div>
    <p className="text-white text-lg font-semibold">{Number(coin.circulating_supply).toLocaleString()}</p>
    {coin.max_supply > 0 && (
      <div className="mt-2">
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full " 
            style={{ width: `${(coin.circulating_supply / coin.max_supply) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}% of max supply
        </p>
      </div>
    )}
  </div>

  {/* Total Supply */}
  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-400 text-sm font-medium">Total Supply</p>
      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
    </div>
    <p className="text-white text-lg font-semibold">{Number(coin.total_supply).toLocaleString()}</p>
    {coin.max_supply > 0 ? (
      <p className="text-xs text-gray-500 mt-1">
        Max: {Number(coin.max_supply).toLocaleString()}
      </p>
    ) : (
      <p className="text-xs text-gray-500 mt-1">No maximum supply</p>
    )}
  </div>
</div>
      </CardContent>
    </Card>
    </div>
  );
};

export default CoinSnapshot;
