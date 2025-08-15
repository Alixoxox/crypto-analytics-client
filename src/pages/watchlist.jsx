import CoinViewNavbar from "@/components/navbar";
import { UserContext } from "@/context/main";
import React, { useContext, useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { getCoinNames } from "@/utils/fetchdata";
import { useNavigate } from "react-router-dom";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import LoadingScreen from "@/components/Loading";
import { API_BASE_URL } from "@/utils/fetchdata";
export default function WatchlistPage() {
  const navigate = useNavigate();
  const { coinList, setCoinList, user } = useContext(UserContext);
  const [coins, setCoins] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading,setloading] = useState(true);
  useEffect(() => {
    if (!user.email) navigate("/account/login");
    const timer = setTimeout(() => setloading(false), 500);
    return () => clearTimeout(timer); // cleanup
  }, [user]);
  const formatNumber = (num) => {
    return num >= 1e12
      ? `$${(num / 1e12).toFixed(2)}T`
      : num >= 1e9
      ? `$${(num / 1e9).toFixed(2)}B`
      : `$${num}`;
  };
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const list = await getCoinNames();
        setCoinList(list);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      }
    };
    if (coinList.length === 0) fetchCoins();
  }, []);

  const fetchwatchingCoins = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/user/view/watching`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
           "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({ email: user.email }),
      });
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      const data = await res.json();
      setCoins(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  useEffect(() => {
    if (user.email) fetchwatchingCoins();
  }, [user]);

  const filteredCoins = coinList.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    setCoins((prev) => prev.filter((coin) => coin.coinId !== id));
    const token = localStorage.getItem("jwt");
    await fetch("http://localhost:8080/user/delete/watching", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
         "ngrok-skip-browser-warning": "1",
        "Authorization": `Bearer ${token}`,
      },body: JSON.stringify({
        email: user.email,
        coinName: id})
      })
  };

  const handleSelectCoin = (name) => {
    setSearchTerm(name);
    setShowDropdown(false);
  };

  const handleAddCoin = async() => {
    if (!searchTerm.trim()) return;
    if (coins.some((coin) => coin.coinId.toLowerCase() === searchTerm.toLowerCase())) {
      setSearchTerm("");
      setShowSearch(false);
      return;
    }
    const token = localStorage.getItem("jwt");
    await fetch("http://localhost:8080/user/add/watching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
         "ngrok-skip-browser-warning": "1"
      },body: JSON.stringify({
        email: user.email,
        coinName: searchTerm.trim()})
      })
    await fetchwatchingCoins()
    setSearchTerm("");
    setShowSearch(false);
  };
if(loading) return <LoadingScreen />;
  return (
    <>
      <CoinViewNavbar />
      <div className="bg-[#1a1a1a] min-h-screen text-white">
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <h1 className="text-3xl font-bold">My Watchlist</h1>
            <div className="flex items-center gap-3 relative">
              {showSearch && (
                <div className="relative w-48 sm:w-64 animate-fade-in">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() => searchTerm && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Search coin..."
                    className="bg-[#1f1f1f] border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm w-full outline-none focus:border-indigo-500"
                  />
                  {showDropdown && filteredCoins.length > 0 && (
                    <ul className="absolute z-10 bg-[#2a2a2a] mt-1 w-full max-h-40 overflow-y-auto rounded border border-gray-600">
                      {filteredCoins.map((name, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleSelectCoin(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <button
                onClick={() => (showSearch ? handleAddCoin() : setShowSearch(true))}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition px-5 py-2 rounded-full text-sm font-medium shadow-md"
              >
                <FiPlus /> {showSearch ? "Add" : "Add Coin"}
              </button>
            </div>
          </div>

          <section>
            <div className="overflow-x-auto rounded-lg shadow-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] text-left text-sm text-gray-300">
                    <th className="py-4 px-6">Coin</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">24h Change</th>
                    <th className="py-4 px-6">24h High / Low</th>
                    <th className="py-4 px-6">Market Cap</th>
                    <th className="py-4 px-6">Market Rank</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {coins.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-5 text-center text-gray-400">
                        Your watchlist is empty.
                      </td>
                    </tr>
                  )}
                  {coins.map((c) => (
                    <tr key={c.coinId} className="border-t transition hover:bg-[#222222]">
                      <td className="py-5 px-6 flex items-center gap-4">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={c.image || "https://via.placeholder.com/40"}
                          alt={c.coinId}
                        />
                        <div className="text-sm font-medium capitalize">{c.coinId}</div>
                      </td>
                      <td className="py-5 px-6 text-sm">${c.current_price}</td>
                      <td
                        className={`py-5 px-6 text-sm font-semibold ${
                          c.price_change_percentage_24h > 0
                            ? "text-green-500"
                            : c.price_change_percentage_24h < 0
                            ? "text-red-500"
                            : "text-gray-300"
                        }`}
                      >
                        {c.price_change_percentage_24h > 0 ? (
                          <MdArrowDropUp className="inline" />
                        ) : (
                          <MdArrowDropDown className="inline" />
                        )}
                        {c.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="py-5 px-6 text-sm">
                        {formatNumber(c.low_24h)} / {formatNumber(c.high_24h)}
                      </td>
                      <td className="py-5 px-6 text-sm">{formatNumber(c.market_cap)}</td>
                      <td className="py-5 px-6 text-sm ">{c.market_cap_rank}</td>
                      <td className="py-5 px-6 text-center">
                        <button
                          onClick={() => handleDelete(c.coinId)}
                          className="p-2 rounded-full hover:bg-red-600/20 transition hover:cursor-pointer"
                          title="Delete Coin"
                        >
                          <FiTrash2 className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
