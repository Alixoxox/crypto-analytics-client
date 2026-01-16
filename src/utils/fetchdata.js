export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCoins() {
  const response = await fetch(`${API_BASE_URL}/api/coins`);
  return response.json();
}

export const GettrendingCoins = async () => {
  try {
    const response= await fetch(`${API_BASE_URL}/coins/trending`)
      if (!response.ok) throw new Error('Backend Down For Maintenance');
      return response.json();
    
  } catch (err) {
    console.error(err);
    return []
  }
};
export const PING = async () => {
  try {
    const response= await fetch(`${API_BASE_URL}/ping`)
      if (!response.ok) throw new Error('Backend Down For Maintenance');
      return ;
    
  } catch (err) {
    console.error(err);
  }
};

export const getTopMovers = async () => {
  try {
   const response=await fetch(`${API_BASE_URL}/coins/gainers`)
   
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
    const response=await fetch(`${API_BASE_URL}/coins/chart?name=${coinId}`)
    if(!response) throw new Error("Failed to fetch chart data");
    return response.json()
  }catch(err){
    console.error(err);
    return []
  }}

export const getMarketreview = async () => {
  try{
    const response=await fetch(`${API_BASE_URL}/market/info`)
    if(!response) throw new Error("Failed to fetch market data");
    return response.json();
  }catch(err){  
    console.error(err);
    return []
  }}
  export const getIndividualCoin = async (coinId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/coin/detail?id=${coinId}`);
  
      if (!response.ok) {
        const errData = await response.json()  
        throw new Error(errData  || 'Failed to fetch data');
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getIndividualCoin:", err);
      return { error: err.message };
    }
  };

  export const getTopRakers=async(limit)=>{
    try {
      const response = await fetch(`${API_BASE_URL}/coins/topRank?limit=${limit}`);
      if (!response.ok) {
        const errData = await response.json()  
        throw new Error(errData  || 'Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getIndividualCoin:", err);
      return { error: err.message };
    }
  }
  export const getCoinNames=async(limit)=>{
    try {
      const response = await fetch(`${API_BASE_URL}/coins/name`);
      if (!response.ok) {
        const errData = await response.json()  
        throw new Error(errData  || 'Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getting coin names:", err.error || err.message || err);
      return { error: err.message };
    }
  }
export const Comparecoins = async (coin1, coin2) => {
try{ const response = await fetch(`${API_BASE_URL}/coins/compare?coin1=${coin1}&coin2=${coin2}`);
  if (!response.ok) {
    const errData = await response.json()  
    throw new Error(errData  || 'Failed to fetch data');
  }
  const data = await response.json();
  return data;

}catch(err){
  console.error("Error in Comparecoins:", err);
  return { error: err.message };

}}

export const googleLogin = async (name,email,picture,sub) => {
  try {
    if (!name || !email || !picture || !sub) throw new Error("Invalid user data");
    const response = await fetch(`${API_BASE_URL}/google/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        name: name,
        googleId: sub,
        pictureUrl: picture
      }),
    })
  if (!response.ok) {
    const errData = await response.text()  
    throw new Error(errData  || 'Failed to fetch data');
  }
  const data = await response.text();
  localStorage.setItem("jwt", data);
}catch(err) {
  console.error("Error in googleLogin:", );
  return { error: err.message };
}}

export const LoginManual = async (email, password) => {
try{
  if( !email || !password){
  throw new Error("Invalid user data");}
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
if (!response.ok) {
  const errData = await response.json()  
  console.log(errData);
  throw new Error(errData || 'Failed to fetch data');
}
const data = await response.json();
localStorage.setItem("jwt", data.token);
return data.User;
}catch(err) {
  console.error("Error in login:", err.error || err.message || err);
}}
export const Registration = async (name,email, password) => {
  try{
    if (!name || !email || !password) throw new Error("Invalid user data");
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
       },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
  if (!response.ok) {
    const errData = await response.text()  
    console.log(errData);
    throw new Error(errData||errData || 'Failed to fetch data');
  }
  const data = await response.text();
 console.log("Registration successful:", data);
  localStorage.setItem("jwt", data);
 
  }catch(err) {
  console.error("Error in registration:", err);
  return { error: err.message };
  }}
  
export const changePassword = async (email, Password) => {
  try{
    if( !email && !Password){
    throw new Error("Invalid user data");}
    const response = await fetch(`${API_BASE_URL}/account/changePass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
       },
      body: JSON.stringify({
        email: email,
        password: Password,
      }),
    })
  if (response.ok) {
   return { success: true, message: "Password changed successfully" };
  }
  const errData = await response.json()  
  throw new Error(errData  || 'Failed to fetch data');

  }catch(err) {
  console.error("Error in changing pass :", err);
  return { error: err.message };
  }}

  export const Linkgoogle = async (email, googleId) => {
    try{
      if( !email && !googleId){
      throw new Error("Invalid user data");}
      const response = await fetch(`${API_BASE_URL}/account/linkG`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
           },
        body: JSON.stringify({
          email: email,
          googleId: googleId,
        }),
      })
      if(response.ok){
        return { success: true, message: "Google account linked successfully" };
      }
    else{
      const errData = await response.json()  
      throw new Error(errData  || 'Failed to fetch data');
    }
    
    }catch(err) {
    console.error("Error in Linking google :", err);
    return { error: err.message };
    }}
  
    export const UnLinkgoogle = async (email) => {
      try{
        if( !email ){
        throw new Error("Invalid user data");}
        const response = await fetch(`${API_BASE_URL}/account/UnlinkG`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
               },
          body: JSON.stringify({
            email: email,
          }),
        })
        if(response.ok){
        return { success: true, message: "Google account unlinked successfully" };
        }
      else {
        const errData = await response.json()  
        throw new Error(errData  || 'Failed to fetch data');
      }
      
      }catch(err) {
      console.error("Error in UnlinkG :", err);
      return { error: err.message };
      }}

export const DeleteAcc = async (email) => {
        try{
          if( !email){
          throw new Error("Invalid user data");}
          const response = await fetch(`${API_BASE_URL}/account/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
                   },
            body: JSON.stringify({
              email: email,
            }),
          })
        if (response.ok) {
         return { success: true, message: "Account deleted successfully"  };
        }
       else{
        const errData = await response.json()  
        throw new Error(errData  || 'Failed to fetch data');
       }
        }catch(err) {
        console.error("Error in DeleteAcc :", err);
        return { error: err.message };
        }}

       export const uploadImage = async (file,email) => {
        console.log(file)
          const formData = new FormData();
          formData.append("file", file);
        
          const res = await fetch(`${API_BASE_URL}/imgUpload/${email}`, {
            method: "POST",
            headers: {
                  },
            body: formData,
          });
        
          const data = await res.json();
          console.log("Image URL:", data);
          return data
        };