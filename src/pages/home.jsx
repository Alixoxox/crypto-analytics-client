// Coinalytix - One-to-one replica of BlockPulse hero using Tailwind CSS
import Back from "../assets/back-home.png"
import main from "../assets/main-home.png"
import background from "../assets/background.png"
import Homenav from "@/components/homenav";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate=useNavigate()
  
  return (
    <div
      className="min-h-screen text-white font-sans w-full  "
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Navbar */}
      <Homenav/>
      
      {/* Hero Section */}
      <section className="max-w-[1100px] mx-auto px-6 mt-3 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10 min-h-[80vh]">
        {/* Left Content */}
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Stay Ahead with <br /> Simple <span className="bg-purple-600 px-2 rounded">Brc-20</span> Insights
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
          Track prices, spot trends, and follow market moves — all in one easy-to-use app, no crypto experience needed.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-md hover:bg-violet-600 hover:cursor-pointer" onClick={()=>navigate("/Overview/")}>
              Start Now  <span className="text-xl">➤</span>
            </button>
            {/* <button className="border border-purple-500 text-purple-400 px-6 py-3 rounded-full font-medium shadow-md">
              ❤️
            </button> */}
          </div>

          {/* News Card */}
          {/* <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm w-[300px]">
            <p className="text-white text-sm font-semibold mb-1">News Headling will be this text..</p>
            <p className="text-gray-400 text-xs">News element is here and Heading will be this text...</p>
            <button className="mt-3 text-xs text-purple-400 font-semibold underline">More info</button>
          </div> */}
        </div>

        {/* Right Side - Images */}
        <div className="relative hidden md:flex  flex-1 justify-center items-center z-10 max-w-full max-h-full  ">
          <img
            src={Back}
            alt="background illustration"
            className="absolute inset-0 w-full h-full object-contain z-0 scale-110"
          />
          <img
            src={main}
            alt="main illustration"
            className="relative w-full max-w-[1180px] h-auto z-10 scale-125"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-6 py-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 ">
        <div className="flex items-center gap-4">
          <span>Connect</span>
          <a href="#" className="text-purple-500">🐦</a>
          <a href="#" className="text-purple-500">✒</a>
        </div>
        <div className="flex items-center gap-4">
          <span>Media</span>
          <span className="text-green-400 font-bold">MW</span>
          <span className="text-purple-400 font-bold">¥</span>
        </div>
        <div className="text-center md:text-right">© 2025 BlockPulse. All rights reserved.</div>
      </footer>
    </div>
  );
}