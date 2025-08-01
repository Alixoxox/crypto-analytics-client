import React, { use, useContext, useEffect, useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/main';
import { Button } from './ui/button';
import fallbackimg from '@/assets/userplaceholder.png';
export default function CoinViewNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setisOpen, user } = useContext(UserContext);
  const navigationItems = ["Overview", "Markets", "Compare","Account"];
  const [search, setSearch] = useState("");
  return (
    <header className="flex flex-col bg-[#1a1a1a] text-white border-b border-[#363636]">
      <div className="flex items-center justify-between px-2 sm:px-6 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center text-2xl sm:text-3xl font-extrabold hover:cursor-pointer"
        >Block<span className="text-purple-500">Pulse</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map(item => (
            <span
              key={item}
              onClick={() => {
                if (item === "Compare") {
                  navigate(`/${item}/select`);
                } else {
                  navigate(`/${item}/`);
                }
              }}
              className="text-gray-300 hover:text-white text-sm font-medium hover:cursor-pointer">
              {item}
            </span>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Field */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#363636] text-white rounded-full pl-5 pr-4 py-2 text-sm focus:outline-none transition-colors w-50 sm:w-64"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 hover:scale-[1.05] cursor-pointer" onClick={()=>{search!==""? navigate(`/coin/${search}`):null;}} />

          </div>

          {/* Notification Button */}
          <button className="flex ms-1 items-center hover:cursor-pointer hover:scale-[1.01] justify-center h-10 w-10 bg-[#363636] rounded-full"onClick={() => navigate("/notify")}>
            <Bell className="w-5 h-5 text-white" />
          </button>
          {user?.email ? (<img
            src={user.picture || fallbackimg}
            referrerPolicy="no-referrer"
            alt="User"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full object-cover hover:cursor-pointer"
            onClick={() => navigate("/account/")}
            />) : (<Button
            variant="outline"
            className="text-white border-white hover:bg-white/10"
            onClick={() => {
              setisOpen(true)
              navigate("/account/login")
            }}>Login</Button>)

          }
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
              href="#"
              className="block text-gray-300 hover:text-white py-2 border-b border-gray-700 hover:cursor-pointer "
              onClick={() => {
                if (item === "Compare") {
                  navigate(`/${item}/select`);
                } else {
                  navigate(`/${item}/`);
                }
              }} >
              {item}
            </span>
          ))}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#363636] text-white rounded-full px-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
