import React, {  useState } from "react";
import { assessRisk,riskTypes } from "@/utils/extras"; // Assuming this function is defined in utils
import { useNavigate } from "react-router-dom";

export default function RiskAssessmentTable({TopMarketData}) {
  const [filter, setFilter] = useState(null);
  const navigate= useNavigate();
  const assetsWithRisk = TopMarketData.map(asset => ({
    ...asset,
    risk: assessRisk(asset),
  }));

  const filteredAssets = filter
    ? assetsWithRisk.filter(asset => asset.risk.includes(filter))
    : assetsWithRisk;

    
  function calculateRiskScore(asset) {
    const changeScore = Math.min(Math.abs(asset.price_change_percentage_24h), 100);
    const volumeRatio = asset.total_volume / asset.market_cap;
    const volumeScore = Math.min(volumeRatio * 100, 100);
    const athScore = Math.abs(asset.ath_change_percentage);
    const rankScore = Math.min(asset.market_cap_rank, 100);
    const score = (
      changeScore * 0.4 +
      volumeScore * 0.3 +
      athScore * 0.2 +
      rankScore * 0.1
    );

    return Math.round(Math.min(score, 100));
  }

  return (
    <div className=" text-white p-6 pt-0 rounded-xl  mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {riskTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type === filter ? null : type)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition ${filter === type
                ? "bg-white text-black"
                : "bg-[#1f1f1f] text-white border border-[#333]"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left border-collapse rounded-xl overflow-hidden ">
          <thead>
            <tr className="bg-[#1f1f1f] text-[#cfcfcf] border-b border-[#333]">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">24h Change</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset._id} className="border-b border-[#222] hover:bg-[#1a1a1a] hover:cursor-pointer" onClick={()=>navigate(`/coin/${asset.coinId}`)}>
                <td className="px-4 py-3">{asset.market_cap_rank}</td>
                <td className="px-4 py-3 capitalize flex items-center gap-2">
                  <img src={asset.image} alt="" className="w-5 h-5" />
                  {asset.coinId}
                </td>
                <td className="px-4 py-3">${asset.current_price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  {asset.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="px-4 py-3 flex gap-2 flex-wrap">
                  {asset.risk.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#2a2a2a] text-white text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">{calculateRiskScore(asset)}</td>

              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-[#777]">
                  No assets match this risk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
