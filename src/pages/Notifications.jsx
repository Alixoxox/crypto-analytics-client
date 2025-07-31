import { useEffect, useState } from 'react';
import {
  Bell,
  TrendingUp,
  Newspaper,
  BarChart,
  GraduationCap
} from 'lucide-react';
import CoinViewNavbar from '@/components/navbar';

const icons = {
  "Price Alert": <TrendingUp className="w-5 h-5 text-white" />,
  "Market Update": <BarChart className="w-5 h-5 text-white" />,
  "Exchange News": <Newspaper className="w-5 h-5 text-white" />,
  "Portfolio Update": <BarChart className="w-5 h-5 text-white" />,
  "Educational Content": <GraduationCap className="w-5 h-5 text-white" />,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      "title": "Price Alert",
      "message": "Bitcoin price reached $30,000",
      "timeAgo": "2h ago"
    },
    {
      "title": "Portfolio Update",
      "message": "Your portfolio value increased by 5%",
      "timeAgo": "2d ago"
    }
  ]);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Replace this with your actual API call
//       const res = await fetch("http://localhost:8080/api/notifications");
//       const data = await res.json();
//       setNotifications(data);
//     };

//     fetchData();
//   }, []);

  return (<>
  <CoinViewNavbar/>
    <div className="bg-[#1a1a1a] min-h-screen text-white text-2xl font-bold px-6 py-5">
      <h1 className="text-3xl mb-6">Notifications</h1>
      <div className="space-y-5 ms-2 md:me-10">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="bg-[#262626] p-3 rounded-lg">
              {icons[n.title] || <Bell className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{n.title}</h3>
              <p className="text-sm font-semibold text-gray-400">{n.message}</p>
            </div>
            <div className="ml-auto text-sm text-gray-500 whitespace-nowrap">
              {n.timeAgo}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
