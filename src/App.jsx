import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CoinSnapshot from './components/coindetail.jsx';
import Login from "./pages/login.jsx"
import RegisterComponent from './pages/register.jsx';
import Compare from './pages/Compare.jsx';
import { PING } from './utils/fetchdata.js';
import { checktoken } from './utils/extras.js';
import AccountSettings from './pages/account.jsx';
import Market from './pages/Market.jsx';
import { UserContext } from './context/main.jsx';
import Notifications from './pages/Notifications.jsx';
function App() {
  const {user} = useContext(UserContext);
  useEffect(() => {
    async () => {
     await PING();
     await checktoken()
     }}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Overview/" element={<Dashboard />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<RegisterComponent />} />
        <Route path="/coin/:id" element={<CoinSnapshot />} />
        <Route path="/Account/" element={<AccountSettings />} />
        <Route path="/Compare/:id" element={<Compare />} />  
        <Route path="/Markets/" element={<Market />} />
        <Route path="/notify" element={<Notifications />} />
      </Routes>
    </Router>

  );
}

export default App;