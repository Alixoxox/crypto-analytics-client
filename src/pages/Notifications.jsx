import { use, useContext, useEffect, useState } from 'react';
import {
  Bell,
  TrendingUp,
  Newspaper,
  BarChart,
  GraduationCap,
  TrendingDown 
} from 'lucide-react';
import CoinViewNavbar from '@/components/navbar';
import { UserContext } from '@/context/main';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/Loading';

const icons = {
  "Price Increase": <TrendingUp className="w-5 h-5 text-white" />,
  "Price Decrease": <TrendingDown className="w-5 h-5 text-white" />,
  "Market Update": <BarChart className="w-5 h-5 text-white" />,
  "Exchange News": <Newspaper className="w-5 h-5 text-white" />,
  "Portfolio Update": <BarChart className="w-5 h-5 text-white" />,
  "Educational Content": <GraduationCap className="w-5 h-5 text-white" />,
};

export default function Notifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {user}=useContext(UserContext);
  useEffect(() => {
    if (user?.email === null) {
      navigate("/account/login");
    }
  }, [user, navigate]);
    const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Replace this with your actual API call
      const res = await fetch("http://localhost:8080/user/notify");
      const data = await res.json();
      console.log(data);
      setNotifications(data);
      setLoading(false);
    };

    fetchData();
  }, []);
  if(loading) return <LoadingScreen/>;
  return (<>
  <CoinViewNavbar/>
    <div className="bg-[#1a1a1a] min-h-screen text-white text-2xl font-bold px-6 py-5">
      <h1 className="text-3xl mb-6">Notifications</h1>
      <div className="space-y-5 ms-2 md:me-10 lg:mx-10">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="bg-[#262626] p-3 rounded-lg">
              {icons[n.title] || <Bell className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-bold capitalize">{n.title}</h3>
              <p className="text-sm font-semibold text-gray-400 capitalize">{n.message}</p>
            </div>
          
            <div className="ml-auto text-sm text-gray-500 whitespace-nowrap">
              {new Date(n.lastUpdated).toLocaleDateString('en-US')}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
