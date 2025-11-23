import React, { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import api from './lib/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // لتجنب الظهور المبكر للـ Dashboard

  // تحقق من التوكن عند فتح التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers = api.defaults.headers || {};
    api.defaults.headers.common = api.defaults.headers.common || {};
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.get('/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // عند تسجيل الدخول أو التسجيل
  const onAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    api.defaults.headers = api.defaults.headers || {};
    api.defaults.headers.common = api.defaults.headers.common || {};
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(user);
  };

  // عند تسجيل الخروج
  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // عرض شاشة تحميل أثناء التحقق من التوكن
  if (loading) return <div>Loading...</div>;

  // إذا ما فماش مستخدم، عرض صفحة تسجيل الدخول / التسجيل
  if (!user) return <AuthPage onAuth={onAuth} />;

  // إذا توكن صالح، عرض الـ Dashboard
  return <Dashboard onLogout={onLogout} />;
}
