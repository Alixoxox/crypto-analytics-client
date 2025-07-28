import Navbar from "@/components/Navbar"; // adjust the import path as needed

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white text-sm opacity-80">Fetching live data...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
