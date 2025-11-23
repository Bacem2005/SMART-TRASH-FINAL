import React, { useState } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';

export default function AuthPage({ onAuth }) {
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setMsg('');
  try {
    const res = await api.post('/login', {
      email: loginData.email,
      password: loginData.password
    });

    if (res.data.token) onAuth(res.data.token, res.data.user);
    else setMsg(res.data.message || 'Login failed');
  } catch (err) {
    setMsg(err.response?.data?.message || 'Login error');
  }
};

  const handleRegister = async (e) => {
  e.preventDefault();
  setMsg('');
  try {
    const res = await api.post('/register', {
      name: regData.name,
      email: regData.email,
      password: regData.password
    });

    if (res.data.success) onAuth(res.data.token, res.data.user);
    else setMsg(res.data.message || 'Registration failed');
  } catch (err) {
    setMsg(err.response?.data?.message || 'Register error');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass w-[440px]">
        <h2 className="text-2xl font-semibold text-center mb-2">Smart Bin Access</h2>
        <p className="text-center text-slate-400 mb-6">Secure access to your device</p>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-xl ${tab==='login' ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-300 border border-slate-700'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-2 rounded-xl ${tab==='register' ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-300 border border-slate-700'}`}>Register</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className='space-y-4'>
            <input className='w-full p-3 rounded-lg bg-slate-900 border border-slate-700' placeholder='Email' value={loginData.email} onChange={e=> setLoginData({...loginData, email: e.target.value})} required />
            <input type='password' className='w-full p-3 rounded-lg bg-slate-900 border border-slate-700' placeholder='Password' value={loginData.password} onChange={e=> setLoginData({...loginData, password: e.target.value})} required />
            <button className='w-full py-3 rounded-lg bg-brand-500 hover:bg-brand-700 text-white'>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className='space-y-4'>
            <input className='w-full p-3 rounded-lg bg-slate-900 border border-slate-700' placeholder='Full name' value={regData.name} onChange={e=> setRegData({...regData, name: e.target.value})} required />
            <input className='w-full p-3 rounded-lg bg-slate-900 border border-slate-700' placeholder='Email' value={regData.email} onChange={e=> setRegData({...regData, email: e.target.value})} required />
            <input type='password' className='w-full p-3 rounded-lg bg-slate-900 border border-slate-700' placeholder='Password' value={regData.password} onChange={e=> setRegData({...regData, password: e.target.value})} required />
            <button className='w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white'>Create Account</button>
          </form>
        )}

        {msg && <p className='text-red-400 mt-4 text-center'>{msg}</p>}
      </motion.div>
    </div>
  );
}
