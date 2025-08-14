import React, { useState, useEffect } from "react";
import { riskTypes, assessRisk } from "@/utils/extras";
import { useNavigate } from "react-router-dom";
import { MdArrowDropUp,MdArrowDropDown } from "react-icons/md";
export default function RiskAssessmentTable({ allAssets,hide }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  function calculateRiskScore(asset) {
    const changeScore = Math.min(Math.abs(asset.price_change_percentage_24h), 100);
    const volumeRatio = asset.total_volume / asset.market_cap;
    const volumeScore = Math.min(volumeRatio * 100, 100);
    const athScore = Math.abs(asset.ath_change_percentage);
    const rankScore = Math.min(asset.market_cap_rank, 100);
    const score =
      changeScore * 0.4 +
      volumeScore * 0.3 +
      athScore * 0.2 +
      rankScore * 0.1;

    return Math.round(Math.min(score, 100));
  }

  // Add risk tag to each asset
  const assetsWithRisk = allAssets.map(asset => ({
    ...asset,
    risk: assessRisk(asset),
  }));

  // Filter assets
  const filteredAssets = filter
    ? assetsWithRisk.filter(asset => asset.risk.includes(filter))
    : assetsWithRisk;

  // Pagination
  const maxPage = Math.ceil(filteredAssets.length / pageSize);
  const paginatedAssets = filteredAssets.slice(page * pageSize, (page + 1) * pageSize);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
  }, [filter]);

  return (
    <div className="text-white p-0 md:p-6 pt-0 rounded-xl mx-auto">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {riskTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type === filter ? null : type)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
              filter === type
                ? "bg-white text-black"
                : "bg-[#1f1f1f] text-white border border-[#333]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left border-collapse rounded-xl overflow-hidden">
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
            {paginatedAssets.map((asset) => (
              <tr
                key={asset._id}
                className="border-b border-[#222] hover:bg-[#1a1a1a] hover:cursor-pointer"
                onClick={() => navigate(`/coin/${asset.coinId}`)}
              >
                <td className="px-4 py-3">{asset.market_cap_rank}</td>
                <td className="px-4 py-3 capitalize flex items-center gap-2">
                  <img src={asset.image} alt="" className="w-5 h-5" />
                  {asset.coinId}
                </td>
                <td className="px-4 py-3">${asset.current_price}</td>
                <td
                  className={`px-4 py-3 font-semibold  ${
                    asset.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >{asset.price_change_percentage_24h > 0 ? (
                  <MdArrowDropUp className="inline" />) : (
                  <MdArrowDropDown className="inline" />)}
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
            {paginatedAssets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-[#777]">
                  No assets match this risk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{!hide &&(
  (<div className="flex justify-center mt-4 gap-2">
    <button
      onClick={() => setPage(p => Math.max(0, p - 1))}
      disabled={page === 0}
      className="px-4 py-2 bg-zinc-800 rounded-md disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-white text-sm py-2">
      Page {page + 1}
    </span>
    <button
      onClick={() => setPage(p => Math.min(maxPage - 1, p + 1))}
      disabled={page >= maxPage - 1}
      className="px-4 py-2 bg-zinc-800 rounded-md disabled:opacity-50"
    >
      Next
    </button>
  </div>)
)}
      
    </div>
  );
}
