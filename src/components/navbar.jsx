import React, { useContext, useEffect, useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/main';
import { Button } from './ui/button';
import fallbackimg from '@/assets/userplaceholder.png';
import { getCoinNames } from '@/utils/fetchdata';

export default function CoinViewNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setisOpen, user, coinList,setCoinList } = useContext(UserContext);
  const navigationItems = ["Overview", "Markets", "Compare", "WatchList", "Account"];
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
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

  const filteredCoins = coinList
    .filter(name => name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  return (
    <header className="flex flex-col bg-[#1a1a1a] text-white border-b border-[#363636]">
      <div className="flex items-center justify-between px-2 sm:px-6 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center text-2xl sm:text-3xl font-extrabold hover:cursor-pointer"
        >
          Block<span className="text-purple-500">Pulse</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map(item => (
            <span
              key={item}
              onClick={() => {
                navigate(item === "Compare" ? `/${item}/select` : `/${item}/`);
              }}
              className="text-gray-300 hover:text-white text-sm font-medium hover:cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-4 relative">
          {/* Search Field */}
          <div className="relative hidden sm:block w-52 sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search) {
                  navigate(`/coin/${search}`);
                  setShowDropdown(false);
                }
              }}
              className="bg-[#363636] text-white rounded-full pl-5 pr-4 py-2 text-sm w-full focus:outline-none transition-colors"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 hover:scale-[1.05] cursor-pointer"
              onClick={() => search && navigate(`/coin/${search}`)}
            />

            {/* Dropdown */}
            {showDropdown && search && (
              <ul
                className="absolute z-10 bg-[#2a2a2a] mt-1 w-full max-h-48 overflow-y-auto rounded border border-gray-600"
                onMouseDown={(e) => e.preventDefault()} // prevents blur before click
              >
                {filteredCoins.length === 0 ? (
                  <li className="px-4 py-2 text-gray-400 cursor-default">
                    No results found
                  </li>
                ) : (
                  filteredCoins.map((name, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSearch(name);
                        setShowDropdown(false);
                        navigate(`/coin/${name}`);
                      }}
                    >
                      {name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Notification Button */}
          <button
            className="flex ms-1 items-center hover:cursor-pointer hover:scale-[1.01] justify-center h-10 w-10 bg-[#363636] rounded-full"
            onClick={() => navigate("/notify")}
          >
            <Bell className="w-5 h-5 text-white" />
          </button>

          {user?.email ? (
            <img
              src={user.picture || fallbackimg}
              referrerPolicy="no-referrer"
              alt="User"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full object-cover hover:cursor-pointer"
              onClick={() => navigate("/account/")}
            />
          ) : (
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => {
                setisOpen(true);
                navigate("/account/login");
              }}
            >
              Login
            </Button>
          )}

          {/* Hamburger Button */}
          <button
            className="lg:hidden p-2 rounded bg-[#363636] hover:bg-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-3">
          {navigationItems.map(item => (
            <span
              key={item}
              className="block text-gray-300 hover:text-white py-2 border-b border-gray-700 hover:cursor-pointer"
              onClick={() => {
                navigate(item === "Compare" ? `/${item}/select` : `/${item}/`);
              }}
            >
              {item}
            </span>
          ))}
          {/* Optional mobile search */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search) {
                  navigate(`/coin/${search}`);
                  setShowDropdown(false);
                }
              }}
              className="w-full bg-[#363636] text-white rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            {showDropdown && search && (
              <ul
                className="absolute z-10 bg-[#2a2a2a] mt-1 w-full max-h-48 overflow-y-auto rounded border border-gray-600"
                onMouseDown={(e) => e.preventDefault()}
              >
                {filteredCoins.map((name, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSearch(name);
                      setShowDropdown(false);
                      navigate(`/coin/${name}`);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
