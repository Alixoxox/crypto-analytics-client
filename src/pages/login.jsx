import React, { useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import CoinViewNavbar from '@/components/navbar';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/main';
import { googleLogin, LoginManual } from '@/utils/fetchdata';
export default function LoginComponent() {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser}=useContext(UserContext);
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(email.trim() !== "" && password.trim() !== "") {
      const x=await LoginManual(email, password);
      if(x?.error)return;
      setUser({sub: x.googleId, email: x.email, name: x.name, picture: x.pictureUrl});
      navigate("/Overview/");
  };  
  }
  const login = useGoogleLogin({
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
          setUser({sub: userInfo.googleId, email: userInfo.email, name: userInfo.name, picture: userInfo.picture});
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

  return (<> <CoinViewNavbar/>
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a1a] text-gray-200 ">
       
      <div className="w-full max-w-[700px] bg-gradient-to-br from-[#1a1a1a] to-[#2f2f2f]  shadow-2xl rounded-lg overflow-hidden flex flex-col lg:flex-row justify-center ">

        {/* Right side - Login form */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center max-w-full lg:max-w-md order-1 ">
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
            <h1 className="text-xl sm:text-2xl  lg:text-3xl font-bold  mb-6 sm:mb-8 text-center lg:text-left">
              Sign In
            </h1>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium  mb-2">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium  mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-3 py-2.5 sm:py-3 border bg-inherit border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent text-sm sm:text-base"
                />
              </div>
              {/* Sign in button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-800 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium  hover:scale-[1.01] transition duration-200 text-sm sm:text-base"
              >
                Sign In
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-2">
    <span className="h-px w-full bg-gray-600"></span>
    <span className="whitespace-nowrap">or login via</span>
    <span className="h-px w-full bg-gray-600"></span>
  </div>

  <button
    className="w-full bg-purple-100 hover:scale-[1.01] text-black flex items-center justify-center gap-3 py-2.5 rounded-lg font-medium  transition"
    onClick={() => login()}
  >
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
      className="w-5 h-5"
    />
    Continue with Google
  </button>

  {/* Create account link */}
  <p className="text-center text-sm text-gray-400 pt-4">
    Don’t have an account?{" "}
    <span  className="text-purple-400 hover:underline hover:cursor-pointer" onClick={()=>navigate("/account/register")}>
      Create one
    </span>
  </p>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}