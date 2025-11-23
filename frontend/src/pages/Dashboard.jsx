import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';

export default function Dashboard({ onLogout }) {
  const [status, setStatus] = useState('...');
  const [percent, setPercent] = useState(0);
  const [distance, setDistance] = useState(0);
  const [msg, setMsg] = useState('');

  const fetch = async () => {
    try {
      const res = await api.get('/fillstatus');
      if (res.data) {
        setStatus(res.data.status);
        setPercent(res.data.percent);
        setDistance(res.data.distance ?? 0);
      }
    } catch (err) {
      setMsg('Cannot fetch status');
    }
  };

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 3000);
    return () => clearInterval(id);
  }, []);

  const open = async () => {
    setMsg('');
    try {
      const res = await api.get('/open');
      if (res.data.success) setMsg('✅ Opened');
      else if (res.data.reason === 'object_too_close') setMsg('❌ Object too close');
      else setMsg('Open failed');
    } catch {
      setMsg('Open error');
    }
  };

  const close = async () => {
    setMsg('');
    try {
      const res = await api.get('/close');
      if (res.data.success) setMsg('🔒 Closed');
    } catch {
      setMsg('Close error');
    }
  };

  const statusColor = status === 'FULL' ? 'bg-red-600' : status === '50%' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Smart Bin Dashboard</h1>
          <div className='flex items-center gap-4'>
            <button onClick={onLogout} className='px-4 py-2 rounded-lg border border-slate-700'>Logout</button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='card-glass flex gap-6 items-center'>
          <div className='flex-1'>
            <h3 className='text-slate-300'>Fill Level</h3>
            <div className='mt-3 flex items-center gap-4'>
              <div className='w-48 h-48 rounded-xl flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700'>
                <div className='text-center'>
                  <div className='text-4xl font-bold'>{percent}%</div>
                  <div className='text-sm text-slate-400'>{status}</div>
                </div>
              </div>

              <div className='flex-1'>
                <h4 className='text-slate-300 mb-2'>Details</h4>
                <p className='text-slate-400'>Distance: <span className='font-medium'>{distance} cm</span></p>
                <div className={`inline-block mt-4 px-3 py-1 rounded-full text-white ${statusColor}`}>{status}</div>
              </div>
            </div>
          </div>

          <div className='w-64'>
            <h4 className='text-slate-300 mb-2'>Controls</h4>
            <div className='flex flex-col gap-3'>
              <button onClick={open} className='w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white'>Open</button>
              <button onClick={close} className='w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white'>Close</button>
              {msg && <div className='mt-2 text-center text-slate-100 bg-slate-800 p-2 rounded'>{msg}</div>}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
