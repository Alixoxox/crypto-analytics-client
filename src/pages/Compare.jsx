import LoadingScreen from '@/components/Loading';
import CoinViewNavbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { UserContext } from '@/context/main';
import { Comparecoins, getCoinNames } from '@/utils/fetchdata';
import React, { useEffect, useRef, useState, useMemo, use, useContext } from 'react';
import {useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const CompareHeader = () => {
  const {coinList, setCoinList}=useContext(UserContext);
  const [coin1, setCoin1] = useState('');
  const [coin2, setCoin2] = useState('');
  const [coin1Input, setCoin1Input] = useState('');
  const [coin2Input, setCoin2Input] = useState('');
  const [showCoin1Dropdown, setShowCoin1Dropdown] = useState(false);
  const [showCoin2Dropdown, setShowCoin2Dropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const coin2InputRef = useRef(null);
  const [compareData, setCompareData] = useState({coin1: {timestamps:[], prices: []}, coin2: {timestamps:[], prices: []}});
  const { id } = useParams();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (id && id!="select") {
      setCoin1(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const list = await getCoinNames();
        setCoinList(list);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };
    if(coinList.length > 0) return; 
    fetchCoins();
  }, []);

  const chartData = useMemo(() => {
    if (!compareData || !compareData.coin1?.timestamps?.length || !compareData.coin2?.timestamps?.length) return [];
    
    const { coin1: c1, coin2: c2 } = compareData;
    const maxLength = Math.min(c1.timestamps.length, c2.timestamps.length, c1.prices.length, c2.prices.length);
    
    return c1.timestamps.slice(0, maxLength).map((timestamp, index) => ({
      date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp,
      coin1Price: c1.prices[index] || 0,
      coin2Price: c2.prices[index] || 0,
    })).reverse();
  }, [compareData]);

  // Calculate price ranges for better Y-axis scaling
  const priceRanges = useMemo(() => {
    if (!chartData.length) return { coin1: { min: 0, max: 1 }, coin2: { min: 0, max: 1 } };
    
    const coin1Prices = chartData.map(d => d.coin1Price).filter(p => p > 0);
    const coin2Prices = chartData.map(d => d.coin2Price).filter(p => p > 0);
    
    return {
      coin1: {
        min: Math.min(...coin1Prices) * 0.98,
        max: Math.max(...coin1Prices) * 1.02
      },
      coin2: {
        min: Math.min(...coin2Prices) * 0.98,
        max: Math.max(...coin2Prices) * 1.02
      }
    };
  }, [chartData]);

  const filteredCoins1 = coinList.filter(name =>
    name.toLowerCase().includes(coin1Input.toLowerCase())
  );

  const filteredCoins2 = coinList.filter(name =>
    name.toLowerCase().includes(coin2Input.toLowerCase())
  );

  const handleCoin1Select = (name) => {
    setCoin1(name);
    setCoin1Input('');
    setShowCoin1Dropdown(false);
    coin2InputRef.current?.focus();
  };

  const handleCoin2Select = (name) => {
    setCoin2(name);
    setCoin2Input('');
    setShowCoin2Dropdown(false);
  };

  const handleCoin1InputChange = (e) => {
    setCoin1Input(e.target.value);
    setShowCoin1Dropdown(e.target.value.length > 0);
  };

  const handleCoin2InputChange = (e) => {
    setCoin2Input(e.target.value);
    setShowCoin2Dropdown(e.target.value.length > 0);
  };

  const handleCompare = async () => {
    if (coin1 && coin2) {
      setShowResults(true);
      try {
        setloading(true)
        const data = await Comparecoins(coin1, coin2);
        console.log(data)
        setCompareData(data);
        setloading(false)
      } catch (err) {
        console.error('Comparison failed:', err);
        setloading(false)
      }
    }
  };

  // Early return for loading state - AFTER all hooks are declared
  if(loading) return <LoadingScreen/>;

  // Helper function to safely get coin data
  const getCoinData = (coinKey) => {
    return compareData?.[coinKey]?.lastestShot || {};
  };

  const coin1Data = getCoinData('coin1');
  const coin2Data = getCoinData('coin2');

  // Format number safely
  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return num.toLocaleString();
  };

  const formatPrice = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return `$${num}`;
  };

  const formatPercentage = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-spaceGrotesk text-white">
      <CoinViewNavbar />
      <div className="px-10 py-5 gap-1">
                <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Compare</h1>
        <p className="text-gray-400 py-1">
          Stay ahead with real-time insights into the crypto market. Track top performers, analyze trends, and make well informed decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* Coin 1 Input */}
          <div className="relative w-full sm:w-1/2">
            <input
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded"
              placeholder={coin1 || "Search coin 1"}
              value={coin1Input}
              onChange={handleCoin1InputChange}
              onFocus={() => coin1Input && setShowCoin1Dropdown(true)}
              onBlur={() => setTimeout(() => setShowCoin1Dropdown(false), 150)}
            />
            {coin1 && !coin1Input && (
              <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-white">
                {coin1}
              </div>
            )}
            {showCoin1Dropdown && coin1Input && (
              <ul className="absolute z-10 bg-[#2a2a2a] mt-1 w-full max-h-40 overflow-y-auto rounded border border-gray-600">
                 {filteredCoins1.length === 0 ? (
                  <li className="px-4 py-2 text-gray-400 cursor-default">
                    No results found
                  </li>
                ) : ( filteredCoins1.map((name, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCoin1Select(name)}
                  >
                    {name}
                  </li>
                )))}
              </ul>
            )}
          </div>

          {/* Coin 2 Input */}
          <div className="relative w-full sm:w-1/2">
            <input
              ref={coin2InputRef}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded"
              placeholder={coin2 || "Search coin 2"}
              value={coin2Input}
              onChange={handleCoin2InputChange}
              onFocus={() => coin2Input && setShowCoin2Dropdown(true)}
              onBlur={() => setTimeout(() => setShowCoin2Dropdown(false), 150)}
            />
            {coin2 && !coin2Input && (
              <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-white">
                {coin2}
              </div>
            )}
            {showCoin2Dropdown && coin2Input  && (
              <ul className="absolute z-10 bg-[#2a2a2a] mt-1 w-full max-h-40 overflow-y-auto rounded border border-gray-600">
                 {filteredCoins2.length === 0 ? (
                  <li className="px-4 py-2 text-gray-400 cursor-default">
                    No results found
                  </li>
                ) : (filteredCoins2.map((name, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCoin2Select(name)}
                  >
                    {name}
                  </li>
                )))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          {coin1 && (
            <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded">
              <span>{coin1}</span>
              <button
                onClick={() => setCoin1('')}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
          {coin2 && (
            <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded">
              <span>{coin2}</span>
              <button
                onClick={() => setCoin2('')}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleCompare}
          className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!coin1 || !coin2}
        >
          Compare
        </button>
      </div>

      {/* Results Section - Only show when both coins are selected and compare is clicked */}
      {showResults && coin1 && coin2 && coin1Data.coinId && coin2Data.coinId && (
        <div className="px-0 md:px-5 lg:px-10 py-5">
          {/* Price Chart Section */}
          <Card className="bg-inherit mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">Price Chart</CardTitle>
              <div className="text-white">
                <div className="text-sm text-gray-400 mb-2">
                  {coin1Data.coinId?.charAt(0).toUpperCase() + coin1Data.coinId?.slice(1)} vs. {coin2Data.coinId?.charAt(0).toUpperCase() + coin2Data.coinId?.slice(1)}
                </div>
                <div className="text-2xl font-bold">
                  {formatPrice(coin1Data.current_price)} vs. {formatPrice(coin2Data.current_price)}
                </div>
                <div className="flex gap-4 text-sm">
                  <div className={`${coin1Data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin1Data.coinId?.charAt(0).toUpperCase() + coin1Data.coinId?.slice(1)}: 24h {formatPercentage(coin1Data.price_change_percentage_24h)}
                  </div>
                  <div className={`${coin2Data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin2Data.coinId?.charAt(0).toUpperCase() + coin2Data.coinId?.slice(1)}: 24h {formatPercentage(coin2Data.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="w-full h-[300px]"
                config={{
                  coin1Price: {
                    label: coin1Data.coinId?.charAt(0).toUpperCase() + coin1Data.coinId?.slice(1),
                    color: "hsl(280, 100%, 70%)",
                  },
                  coin2Price: {
                    label: coin2Data.coinId?.charAt(0).toUpperCase() + coin2Data.coinId?.slice(1),
                    color: "hsl(200, 100%, 70%)",
                  },
                }}
              >
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="fillCoin1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillCoin2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 100%, 70%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(200, 100%, 70%)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis   
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    minTickGap={32}
                  />
               <YAxis 
  tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(2)}k` : `$${v.toFixed(3)}`}
  tickLine={false} 
  axisLine={false}
  tick={{ fill: '#9CA3AF', fontSize: 10 }}
  domain={[
    Math.min(priceRanges.coin1.min, priceRanges.coin2.min),
    Math.max(priceRanges.coin1.max, priceRanges.coin2.max)
  ]}
/>
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1a1a1a] border border-gray-600 rounded p-3">
                            <p className="text-white font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.dataKey === 'coin1Price' ? 
                                  coin1Data.coinId?.charAt(0).toUpperCase() + coin1Data.coinId?.slice(1) : 
                                  coin2Data.coinId?.charAt(0).toUpperCase() + coin2Data.coinId?.slice(1)
                                }: ${entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    dataKey="coin1Price"
                    type="monotone"
                    fill="url(#fillCoin1)"
                    stroke="hsl(280, 100%, 70%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    dataKey="coin2Price"
                    type="monotone"
                    fill="url(#fillCoin2)"
                    stroke="hsl(200, 100%, 70%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Key Metrics Section */}
          <div className='px-4'>
            <h2 className="text-xl font-semibold text-white mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coin 1 Metrics */}
              <div className="space-y-4">
                <div className='flex gap-4 items-center border-b border-gray-600 pb-2'>
                  {coin1Data.image && <img src={coin1Data.image} className='h-7' alt={coin1Data.coinId} />}
                  <h3 className="text-lg font-medium text-white capitalize">
                    {coin1Data.coinId || 'Unknown'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Cap</span>
                    <span>{formatPrice(coin1Data.market_cap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Supply</span>
                    <span>{formatNumber(coin1Data.total_supply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h Volume</span>
                    <span>{formatPrice(coin1Data.total_volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h High</span>
                    <span>{formatPrice(coin1Data.high_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h Low</span>
                    <span>{formatPrice(coin1Data.low_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">All Time High</span>
                    <span>{formatPrice(coin1Data.ath)}</span>
                  </div>
                </div>
              </div>

              {/* Coin 2 Metrics */}
              <div className="space-y-4">
                <div className='flex gap-4 items-center border-b border-gray-600 pb-2'>
                  {coin2Data.image && <img src={coin2Data.image} className='h-7' alt={coin2Data.coinId} />}
                  <h3 className="text-lg font-medium text-white capitalize">
                    {coin2Data.coinId || 'Unknown'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Cap</span>
                    <span>{formatPrice(coin2Data.market_cap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Supply</span>
                    <span>{formatNumber(coin2Data.total_supply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h Volume</span>
                    <span>{formatPrice(coin2Data.total_volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h High</span>
                    <span>{formatPrice(coin2Data.high_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h Low</span>
                    <span>{formatPrice(coin2Data.low_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">All Time High</span>
                    <span>{formatPrice(coin2Data.ath)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareHeader;