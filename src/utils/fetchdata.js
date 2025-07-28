
export const GettrendingCoins = async () => {
  try {
    const response= await fetch("http://127.0.0.1:8080/coins/trending")
      if (!response.ok) throw new Error('Backend Down For Maintenance');
      return response.json();
    
  } catch (err) {
    console.error(err);
    return []
  }
};
export const PING = async () => {
  try {
    const response= await fetch("http://127.0.0.1:8080/ping")
      if (!response.ok) throw new Error('Backend Down For Maintenance');
      return ;
    
  } catch (err) {
    console.error(err);
  }
};

export const getTopMovers = async () => {
  try {
   const response=await fetch("http://127.0.0.1:8080/coins/gainers")
   
      if (!response.ok) throw new Error("Failed to fetch");
      let data= response.json(); // ← IMPORTANT: parse the JSON
    return data
    .catch((err) => {
      console.error("Error:", err.message);
    });
  } catch (err) {
    console.error(err);
    return []
  }
};

export const getchartData = async (coinId) => {
  try{
    const response=await fetch(`http://127.0.0.1:8080/coins/chart?name=${coinId}`)
    if(!response) throw new Error("Failed to fetch chart data");
    return response.json()
  }catch(err){
    console.error(err);
    return []
  }}

export const getMarketreview = async () => {
  try{
    const response=await fetch(`http://127.0.0.1:8080/market/info`)
    if(!response) throw new Error("Failed to fetch market data");
    return response.json();
  }catch(err){  
    console.error(err);
    return []
  }}
  export const getIndividualCoin = async (coinId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/coin/detail?id=${coinId}`);
  
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || 'Failed to fetch data');
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getIndividualCoin:", err.message);
      return { error: err.message };
    }
  };

  export const getTopRakers=async(limit)=>{
    try {
      const response = await fetch(`http://127.0.0.1:8080/coins/topRank?limit=${limit}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getIndividualCoin:", err.message);
      return { error: err.message };
    }
  }
  export const getCoinNames=async(limit)=>{
    try {
      const response = await fetch(`http://127.0.0.1:8080/coins/name`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getting coi names:", err.message);
      return { error: err.message };
    }
  }
export const Comparecoins = async (coin1, coin2) => {
try{ const response = await fetch(`http://127.0.0.1:8080/coins/compare?coin1=${coin1}&coin2=${coin2}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errData.error || 'Failed to fetch data');
  }
  const data = await response.json();
  return data;

}catch(err){
  console.error("Error in Comparecoins:", err.message);
  return { error: err.message };

}}

export const googleLogin = async (name,email,picture,sub) => {
  try {
    if(!name && !email && !picture && !sub){
    throw new Error("Invalid user data");}
    const response = await fetch("http://127.0.0.1:8080/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        googleId: sub,
        pictureUrl: picture
      }),
    })
  if (!response.ok) {
    const errData = await response.text().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errData.error || 'Failed to fetch data');
  }
  const data = await response.text();
  localStorage.setItem("jwt", data);
}catch(err) {
  console.error("Error in googleLogin:", err.message);
  return { error: err.message };
}}

export const LoginManual = async (email, password) => {
try{
  if( !email && !password){
  throw new Error("Invalid user data");}
  const response = await fetch("http://127.0.0.1:8080/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
if (!response.ok) {
  const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
  throw new Error(errData.error || 'Failed to fetch data');
}
const data = await response.json();
console.log("Login successful:", data);
console.log(data.token)
localStorage.setItem("jwt", data.token);
return data.User;
}catch(err) {
console.error("Error in login :", err.message);
return { error: err.message };
}}
export const Registration = async (name,email, password) => {
  try{
    console.log("Registration called with:", { name, email, password });
    if(!name && !email && !password){
    throw new Error("Invalid user data");}
    const response = await fetch("http://127.0.0.1:8080/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
  if (!response.ok) {
    const errData = await response.text().catch(() => ({ error: 'Unknown error' }));
    console.log(errData);
    throw new Error(errData || 'Failed to fetch data');
  }
  const data = await response.text();
 console.log("Registration successful:", data);
  localStorage.setItem("jwt", data);
 
  }catch(err) {
  console.error("Error in registration:", err.message);
  return { error: err.message };
  }}
  
  