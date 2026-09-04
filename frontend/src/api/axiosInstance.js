import { API_URL } from "../config/api";
import axios from "axios"
const axiosInstance = axios.create({
  baseURL:API_URL,
});

// Request interceptor - إضافة الـ token تلقائياً
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - التعامل مع أخطاء المصادقة
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // إذا كان الخطأ 401 (غير مصرح) أو 403 (ممنوع)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // إذا كانت الرسالة تتعلق بالـ token
      if (error.response?.data?.message?.includes("token") || 
          error.response?.data?.message?.includes("Token") ||
          error.response?.data?.message?.includes("expired") ||
          error.response?.data?.message?.includes("Invalid")) {
        // حذف الـ token والبيانات المحفوظة
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // إعادة توجيه لصفحة تسجيل الدخول
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;