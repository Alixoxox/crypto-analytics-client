// context/UserContext.js
import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isOpen, setisOpen] = useState(null);
  const [trendingCoins,settrendingCoins]=useState([])
  const [gainCoins,setgainCoins]=useState([])
  const [btc,setbtc]=useState({latestsnapshot:{},prices:[],timestamps:[]});
  const [marketreview,setmarketreview]=useState({});
  const [viewCoin, setviewCoin] = useState({});
  const [TopMarketData, setTopMarketData] = useState([]);
  const [user,setUser]=useState({sub: null, email: null, name: null, picture: null});
    const [coinList, setCoinList] = useState([]);
  
  return (
    <UserContext.Provider value={{coinList, setCoinList,user,setUser,TopMarketData, setTopMarketData,viewCoin, setviewCoin,marketreview,setmarketreview,btc,setbtc,gainCoins,setgainCoins, isOpen, setisOpen,trendingCoins,settrendingCoins }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);