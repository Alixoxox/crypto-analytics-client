import React, { useContext } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserContext } from '@/context/main';
import { RiArrowRightUpBoxFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

export default function TopMovers() {
  const navigate=useNavigate()
  const {gainCoins}=useContext(UserContext)
  return (
<div className="flex gap-6 overflow-x-auto whitespace-nowrap scroll-smooth p-6 text-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
<div className="flex gap-6 w-max">
        {gainCoins.map((coin) => (
          <Dialog key={coin._id}>
            <DialogTrigger asChild>
              <Card className="bg-zinc-900 p-4 min-w-[160px] hover:scale-105 transition cursor-pointer">
                <CardContent className="flex flex-col items-center">
                  <img
                    src={coin.image}
                    alt={coin.coinId}
                    width={64}
                    height={64}
                    className="mb-2"
                  />
                  <div className="text-lg font-semibold capitalize">{coin.coinId}</div>
                  <div className="text-sm text-green-400">+{coin.price_change_percentage_24h.toFixed(2)}%</div>
                  <div className="text-sm text-white/70">${coin.current_price}</div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] text-white">
              <DialogHeader>
                <div className='flex justify-between'>
                <DialogTitle className="text-2xl capitalize">{coin.coinId} </DialogTitle>
                <img src={coin.image} className='h-12 me-10'/> 
                </div>
              </DialogHeader>
              <div className="flex items-center gap-2 text-center hover:cursor-pointer text-purple-300 hover:text-purple-400" onClick={()=>navigate("/coin/"+coin.coinId)}>
    View Details <RiArrowRightUpBoxFill />
  </div>              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div><strong>Current Price:</strong> ${coin.current_price}</div>
                <div><strong>High (24h):</strong> ${coin.high_24h}</div>
                <div><strong>Low (24h):</strong> ${coin.low_24h}</div>
                <div><strong>Volume (24h):</strong> ${coin.total_volume}</div>
                <div><strong>Market Cap:</strong> ${coin.market_cap}</div>
                <div><strong>Rank:</strong> {coin.market_cap_rank}</div>
                <div><strong>Supply:</strong> {coin.circulating_supply} / {coin.max_supply || '∞'}</div>
                <div><strong>ATH:</strong> ${coin.ath} ({coin.ath_change_percentage.toFixed(2)}%)</div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
