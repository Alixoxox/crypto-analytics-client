import RiskAssessmentTable from '@/components/dash/risk';
import LoadingScreen from '@/components/Loading';
import CoinViewNavbar from '@/components/navbar';
import { getTopRakers } from '@/utils/fetchdata';
import { MoveRight, MoveLeft } from 'lucide-react';

import React, { useState, useEffect } from 'react';

export default function Market() {
  const [page, setPage] = useState(0);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await getTopRakers(page, 20);
        setCoins(res);
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [page]);
  if(loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 flex flex-col">
      <CoinViewNavbar />
      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold tracking-tight px-4 mb-6 text-white">
          Top Market Data
        </h1>

        <div className="flex items-center justify-between mb-4">
          <p className="text-lg text-gray-400 px-4 font-medium">
            In-Depth Risk Analysis
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="p-2 bg-zinc-800 rounded-md disabled:opacity-50 hover:bg-zinc-700 transition"
            >
              <MoveLeft size={20} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === 5 || loading}
              className="p-2 bg-zinc-800 rounded-md disabled:opacity-50 hover:bg-zinc-700 transition"
            >
              <MoveRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-2">
                     <RiskAssessmentTable TopMarketData={coins} />
  
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="inline-flex -space-x-px shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="px-4 py-2 bg-zinc-800 text-gray-200 rounded-l-md hover:bg-zinc-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-zinc-700 text-gray-300">
              Page {page + 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === 5 || loading}
              className="px-4 py-2 bg-zinc-800 text-gray-200 rounded-r-md hover:bg-zinc-700 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
}
