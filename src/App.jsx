import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CoinSnapshot from './components/coindetail.jsx';
import Login from "./pages/login.jsx";
import RegisterComponent from './pages/register.jsx';
import Compare from './pages/Compare.jsx';
import AccountSettings from './pages/account.jsx';
import Market from './pages/Market.jsx';
import WatchlistPage from './pages/watchlist.jsx';
import Notifications from './pages/Notifications.jsx';
import { UserContext } from "./context/main";
import { PING, getchartData, getMarketreview, getTopMovers, getTopRakers, GettrendingCoins } from "./utils/fetchdata.js";
import { checktoken } from "./utils/extras.js";

function App() {
  const {
    TopMarketData, setTopMarketData,
    gainCoins, setgainCoins,
    btc, setbtc,
    trendingCoins, settrendingCoins,
    marketreview, setmarketreview
  } = useContext(UserContext);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 1. Truly essential data
        const essentialPromises = [];
        if (!btc?.prices?.length) essentialPromises.push(getchartData("bitcoin").then(setbtc));
        if (!gainCoins.length) essentialPromises.push(getTopMovers().then(setgainCoins));
        if (!Object.keys(marketreview).length) essentialPromises.push(getMarketreview().then(setmarketreview));
  
        await Promise.allSettled(essentialPromises); // wait only for essentials
  
        // 2. Lazy load non-essential data
        if (!TopMarketData.length) {
          getTopRakers(10)
            .then(setTopMarketData)
            .catch(err => console.error("Top market data fetch failed:", err));
        }
  
        if (!trendingCoins.length) {
          GettrendingCoins()
            .then(settrendingCoins)
            .catch(err => console.error("Trending coins fetch failed:", err));
        }
  
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
  
    fetchDashboard();
  }, []); // run only once on mount
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Overview/" element={<Dashboard />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<RegisterComponent />} />
        <Route path="/coin/:id" element={<CoinSnapshot />} />
        <Route path="/Account/" element={<AccountSettings />} />
        <Route path="/Compare/:id" element={<Compare />} />  
        <Route path="/Markets/" element={<Market />} />
        <Route path="/notify" element={<Notifications />} />
        <Route path="/WatchList" element={<WatchlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
