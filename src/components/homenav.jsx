import { UserContext } from '@/context/main';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
const homenav = () => {
  const navigate=useNavigate()
  const {user}=useContext(UserContext);
  return (
       <nav className="flex items-center justify-between max-w-[1200px] px-6 md:px-10 mx-auto py-6">
        <div className="text-2xl sm:text-3xl font-extrabold">
          Block<span className="text-purple-500">Pulse</span>
        </div>
        <div className="space-x-10 text-sm font-semibold hidden md:flex">
          <span className="hover:text-purple-400 hover:cursor-pointer" onClick={()=>navigate("/Overview/")}>Discover</span>
          <a href="#" className="hover:text-purple-400">How it Works</a>
        </div>
        <div className='flex gap-4'> <button className=" hidden sm:flex border border-purple-500 text-purple-500 px-6 py-2 rounded-full hover:bg-purple-600 hover:text-white transition font-semibold text-sm hover:cursor-pointer" onClick={()=> navigate("/Overview/")}>  
          Get Started
        </button>
        {user?.email ? (
          <button className="border border-purple-500 text-purple-500 px-6 py-2 rounded-full hover:bg-purple-600 hover:text-white transition font-semibold text-sm hover:cursor-pointer" onClick={()=> navigate("/account/")}>
          Account
        </button>
        ): (<button className="border border-purple-500 text-purple-500 px-6 py-2 rounded-full hover:bg-purple-600 hover:text-white transition font-semibold text-sm hover:cursor-pointer" onClick={()=> navigate("/account/login")}>
          Login
        </button>) 
        }
        </div>
       
      </nav>
    
  )
}

export default homenav
