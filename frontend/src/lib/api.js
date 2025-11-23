import axios from "axios";

// استبدل 192.168.1.12 بالـ IP متاع الكمبيوتر على الشبكة
const api = axios.create({
  baseURL: "http://192.168.1.15:5000/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
