import React, { useContext, useState } from 'react';
import CoinViewNavbar from '@/components/navbar';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { UserContext } from '@/context/main';
import { googleLogin, Registration } from '@/utils/fetchdata';

export default function RegisterComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {setUser}=useContext(UserContext);
  
    const navigate=useNavigate();
  const handleRegister = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (name.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
    const x=await Registration(name, email, password);
    if(x?.error) return;
    setUser({sub: null, email, name, picture: null});
  };}
  const registergoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userInfo = await res.json();
        if (res.ok) {
          const data = await googleLogin(userInfo.name, userInfo.email, userInfo.picture, userInfo.sub);
          if(data?.error){
            return;
          }
          setUser({sub: userInfo.sub, email: userInfo.email, name: userInfo.name, picture: userInfo.picture});
          navigate("/Overview/");
        } else {
          console.error("Error fetching user info:", userInfo);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
    scope: "openid profile email",
  });

  return (
    <>
      <CoinViewNavbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a1a] text-gray-200">
        <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#2f2f2f] shadow-2xl rounded-lg overflow-hidden flex flex-col lg:flex-row max-w-[700px] justify-center">
          
          {/* Registration Form */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center max-w-full lg:max-w-md order-1 ">
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left">
                Create Account
              </h1>

              <div className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 text-sm"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 text-sm"
                  />
                </div>

                {/* Register button */}
                <button
                  onClick={handleRegister}
                  className="w-full bg-purple-600 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium hover:scale-[1.01] transition duration-150"
                >
                  Register
                </button>

                {/* Or with Google */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-2">
                  <span className="h-px w-full bg-gray-600"></span>
                  <span className="whitespace-nowrap">or sign up via</span>
                  <span className="h-px w-full bg-gray-600"></span>
                </div>

                <button
                  className="w-full bg-purple-100 text-black flex items-center justify-center gap-3 py-2.5 rounded-lg font-medium hover:scale-[1.01] transition"
                 onClick={()=>registergoogle()}>
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign up with Google
                </button>

                {/* Already have account */}
                <p className="text-center text-sm text-gray-400 ">
                  Already have an account?{' '}
                  <span className="text-purple-400 hover:underline hover:cursor-pointer" onClick={()=>navigate("/account/login")}>
                    Sign In
                  </span>
                </p>
              </div>
            </div>
          </div>
          </div>
      </div>
    </>
  );
}
