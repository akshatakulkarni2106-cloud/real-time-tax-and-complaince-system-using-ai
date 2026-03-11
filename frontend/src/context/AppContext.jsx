import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();
const API = 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const [token, setToken]     = useState(localStorage.getItem('token') || '');
  const [profile, setProfile] = useState(null);

  const headers = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { if (token) fetchProfile(); }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setProfile(null);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/profile`, headers());
      setProfile(data);
    } catch { logout(); }
  };

  const updateProfile = async (updates) => {
    const { data } = await axios.put(`${API}/profile`, updates, headers());
    setProfile(data);
  };

  const updateProfilePicture = async (base64Image) => {
    const { data } = await axios.put(`${API}/profile/picture`, { profilePicture: base64Image }, headers());
    setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
  };

  const sendChat = async (message) => {
    const { data } = await axios.post(`${API}/chat/send`, { message }, headers());
    return data.reply;
  };

  const getChatHistory = async () => {
    const { data } = await axios.get(`${API}/chat/history`, headers());
    return data;
  };

  const clearChat = async () => {
    await axios.delete(`${API}/chat/history`, headers());
  };

  const getChecklist = async () => {
    const { data } = await axios.get(`${API}/checklist`, headers());
    return data;
  };

  const updateChecklist = async (itemId, checked) => {
    await axios.put(`${API}/checklist/${itemId}`, { checked }, headers());
  };

  return (
    <AppContext.Provider value={{
      token, profile,
      login, register, logout,
      fetchProfile, updateProfile, updateProfilePicture,
      sendChat, getChatHistory, clearChat,
      getChecklist, updateChecklist
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);