import RiskAssessmentTable from '@/components/dash/risk';
import LoadingScreen from '@/components/Loading';
import CoinViewNavbar from '@/components/navbar';
import { getTopRakers } from '@/utils/fetchdata';

import React, { useState, useEffect } from 'react';
import { assessRisk, riskTypes } from '@/utils/extras';

export default function Market() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await getTopRakers(100);
        setCoins(res.map(asset => ({
          ...asset,
          risk: assessRisk(asset),
        })));
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 flex flex-col">
      <CoinViewNavbar />
      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold tracking-tight px-4 mb-6 text-white">
          Top Market Data
        </h1>

        <div className="flex items-center justify-between mb-4">
        <p className="text-lg text-gray-400 px-4 font-medium">
  Explore comprehensive risk evaluations of top cryptocurrencies based on key metrics to help you make well-informed investment decisions.
</p>
         
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-2">
        <RiskAssessmentTable allAssets={coins} />

        </div>

       
      </main>
    </div>
  );
}
