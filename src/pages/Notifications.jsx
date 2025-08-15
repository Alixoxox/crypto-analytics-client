import { useContext, useEffect, useState } from 'react';
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
import { API_BASE_URL } from '@/utils/fetchdata';

const icons = {
  "🚀": <TrendingUp className="w-5 h-5 text-white" />,
  "Market Update": <BarChart className="w-5 h-5 text-white" />,
  // "Exchange News": <Newspaper className="w-5 h-5 text-white" />,
  // "Portfolio Update": <BarChart className="w-5 h-5 text-white" />,
  // "Educational Content": <GraduationCap className="w-5 h-5 text-white" />,
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
      const token=localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/user/notify`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
           "ngrok-skip-browser-warning": "1",
          "Content-Type": "application/json"
        },body: JSON.stringify({ email: user.email})
      })
      if(!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setNotifications(data);
      setLoading(false);
    };

    fetchData();
  }, []);
  const getIcon = (title) => {
    if (!title) return <Bell className="w-5 h-5 text-white" />;
    const key = Object.keys(icons).find(k => title.startsWith(k) || title.includes(k));
    return key ? icons[key] : <Bell className="w-5 h-5 text-white" />;
  };
  if(loading) return <LoadingScreen/>;
  return (<>
  <CoinViewNavbar/>
    <div className="bg-[#1a1a1a] min-h-screen text-white text-2xl font-bold px-6 py-5">
      <h1 className="text-3xl mb-6">Notifications</h1>
      <div className="space-y-5 ms-2 md:me-10 lg:mx-10">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="bg-[#262626] p-3 rounded-lg">
            {getIcon(n.title)}            </div>
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
