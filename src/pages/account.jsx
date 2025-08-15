import React, { useContext, useEffect, useState } from "react";
import CoinViewNavbar from "@/components/navbar";
import { UserContext } from "@/context/main";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGoogleLogin } from "@react-oauth/google";
import { changePassword, DeleteAcc, Linkgoogle, UnLinkgoogle, uploadImage } from "@/utils/fetchdata";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (user?.email === null) {
      navigate("/account/login");
    }
  }, [user, navigate]);
  const [name, setName] = useState(user?.name || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };
  const handleUpdateProfile = async () => {
    if (!profilePic) return alert("Please select an image first.");
    setUser({ ...user, picture: preview });
    setPreview(null);
    setProfilePic(null);
    await uploadImage(profilePic, user.email);
  };

  const handleLogout = () => {setUser({ name: null, email: null, sub: null, picture: null });localStorage.removeItem("jwt");navigate("/account/login");};
  const handleDeleteAccount = async() => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
       const data= await DeleteAcc(user.email)
      if(data?.success){
        setUser({ name: null, email: null, sub: null, picture: null });
        localStorage.removeItem("jwt");
        alert("Account deleted successfully.");
        navigate("/account/login");
      }
    }
  };
  const handleSavePassword = async() => {
    setPwDialogOpen(false);
    const callback=await changePassword(user.email, newPassword);
    if(callback?.success) {
    console.log('Save new password:', newPassword);
    setNewPassword('');
    }
  };
  const linkgoogle = useGoogleLogin({
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
          const data = await Linkgoogle(user.email, userInfo.sub);
          if(data?.success){
            setUser({sub: userInfo.sub, email: userInfo.email, name: userInfo.name, picture: userInfo.picture});          }
        } else {
          console.error("Error fetching user info:", userInfo);
          return;
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
  const UnlinkGoogle= async() => {
    const data=await UnLinkgoogle(user.email);
    if(data?.success){
      setUser({...user, sub: null, picture: null});
      alert("Google account unlinked successfully.");
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <CoinViewNavbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg space-y-10">
          {/* Profile Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition capitalize"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={user?.name}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2"
                  value={user?.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2"
                  onChange={handleProfilePicChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-24 h-24 rounded-lg object-cover border border-zinc-700"
                  />
                )}
              </div>
              <button
                onClick={handleUpdateProfile}
                className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Update Profile
              </button>
            </div>
          </section>

          {/* Security Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Security</h3>
            <div className="flex justify-between items-center bg-zinc-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300">Change Password</p>
              <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
                <DialogTrigger asChild>
                  <button className="bg-zinc-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-zinc-600 transition">
                    Change
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xs bg-zinc-900 text-white p-6 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>New Password</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="mt-4 w-full bg-zinc-800"
                  />
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setPwDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePassword} disabled={!newPassword}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </section>

        {/* Linked Accounts */}
        <section>
                        <h3 className="text-xl font-semibold mb-4">Linked Accounts</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-zinc-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-300">Google Account</p>
                                {user?.sub ? (<button className="bg-zinc-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-zinc-600 transition"onClick={()=>UnlinkGoogle()}>
                                    UnLink
                                </button>): (<button className="bg-zinc-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-zinc-600 transition" onClick={()=>linkgoogle()}>
                                    Link
                                </button>)}
                            </div>
                            {/* <div className="flex justify-between items-center bg-zinc-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-300">Wallet</p>
                                <button className="bg-zinc-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-zinc-600 transition">
                                    Connect
                                </button>
                            </div> */}
                            {/* Actions Section: Logout & Delete */}
                            <div className=" rounded-2xl mt-10  space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Danger Zone</h3>

                                <div className="flex justify-between items-center w-1/2 bg-zinc-800 p-4 rounded-lg">
                                    <p className="text-sm text-red-400">Logout</p>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-red-600 transition"
                                    >
                                        Logout
                                    </button>
                                </div>

                                <div className="flex justify-between items-center w-1/2  p-4 rounded-lg bg-zinc-800">
                                    <p className="text-sm text-red-400">Delete Account</p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>                       
            </section >
        </div >
            </div >
        </div >
  );
};

