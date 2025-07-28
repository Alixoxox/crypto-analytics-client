import React from "react";
import { useNavigate } from "react-router-dom";

const TrendingCryptoList = ({ coins }) => {
  const navigate = useNavigate();
  if (!Array.isArray(coins)) return null; 
  return (
    <div className="text-white p-4 sm:p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">🔥 Trending Coins</h2>

      {/* Responsive Grid: 1 column on mobile, 2 on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {coins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="flex items-center bg-[#1e1e1e] rounded-xl p-2 sm:p-4 hover:bg-[#2a2a2a] transition cursor-pointer overflow-hidden"
          >
            {/* Rank */}
            <div className="text-xl font-bold text-gray-400 pr-4 w-10 text-center">
              {coin.score + 1}
            </div>

            {/* Coin Image */}
            <img
              src={coin.large}
              alt={coin.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
            />

            {/* Coin Info */}
            <div className="flex flex-col flex-grow">
              <div className="font-semibold text-base sm:text-lg">{coin.name}</div>
              <div className="text-gray-400 uppercase text-sm">{coin.symbol}</div>
            </div>

            {/* Price and Change */}
            <div className="text-rights mx-4">
              <div className="text-white font-medium text-sm sm:text-base">
                ${parseFloat(coin.price_usd).toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}
              </div>
              <div
                className={`${
                  coin.priceChangePercentage24hUsd >= 0 ? "text-green-400" : "text-red-400"
                } font-semibold text-xs sm:text-sm `}
              >
                {coin.priceChangePercentage24hUsd.toFixed(2)}%
              </div>
            </div>

            {/* Sparkline (shown only on lg+ and resized) */}
            <img
              src={coin.sparkline}
              alt="sparkline"
              className="hidden md:block h-12 object-contain "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCryptoList;
