import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/auth/logout`);
      if (data.message === "Logged out successfully") {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success('Logged out successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="w-full bg-black text-gray-100 px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-extrabold tracking-wide cursor-pointer" onClick={() => navigate('/')}>
        Resumeon
      </div>
      <div>
        {userData ? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-800 cursor-pointer text-gray-100 relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-5 right-0 z-10 bg-white text-black rounded shadow-lg mt-2">
              <ul className="text-sm p-2 space-y-1 list-none">
                <li onClick={logout} className="hover:text-blue-500 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-2xl bg-gray-800 text-gray-100 font-semibold hover:bg-gray-700 transition"
          >
            Login →
          </button>
        )}
      </div>
    </nav>
  );
}
