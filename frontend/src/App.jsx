
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// صفحات عامة
import Home from "./pages/Home";
// import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./components/SearchResults";

// صفحات المستخدم (رح تضيفيها لاحقًا)

import ServiceDirectory from "./pages/ServiceDirectory";

import ServiceTypes from "./pages/ServiceTypes";
import Notifications from "./pages/Notifications";
import Villages from "./pages/Villages";
import VillageDetails from "./pages/VillageDetails";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import MyRequests from "./pages/MyRequests";
import MyRequestDetails from "./pages/MyRequestDetails";
import MyProfile from "./pages/MyProfile";
import Contact from "./pages/Contact";
import MediaCenter from "./pages/MediaCenter";
import About from "./pages/About";
// صفحات الإدمن
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import CitizenServices from "./pages/admin/CitizenServices";
import AdminServices from "./pages/admin/AdminServices";
import ServiceDetails from "./pages/ServiceDetails";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminServiceTypes from "./pages/admin/AdminServiceTypes";
import AdminAddPerson from "./pages/admin/AdminAddPerson";
import AdminRequestDetails from "./pages/admin/AdminRequestDetails";

import MartyrServices from "./pages/admin/MartyrServices";
import SpecialNeedsServices from "./pages/admin/SpecialNeedsServices";
import AdminPersonDetails from "./pages/admin/AdminPersonDetails";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import AdminContactMessages from "./pages/admin/AdminContactMessage";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminNews from "./pages/admin/AdminNews";
import QRCode from "./components/QRCode";
import AppModal from "./components/AppModal";
// الصفحات الفرعية

import CreateNews from "./pages/admin/CreateNews";
import NewsList from "./pages/admin/NewsList";
// import EditNews from "./pages/admin/EditNews";
import MediaManger from "./pages/admin/MediaManger";

import MangeVillages from "./pages/admin/MangeVillages";
import ManageTowns from "./pages/admin/MangeTowns";
import MangeComments from "./pages/admin/MangeComments";
import DraftNews from "./pages/admin/DraftNews";









// حماية الصفحات
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  // تحميل المستخدم من localStorage عند فتح الموقع
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <AppModal />
      <Routes>
        {/* ========== صفحات عامة + مستخدم ========== */}
        <Route
          path="/*"
          element={
            <>
              <Navbar role={user?.role} onLogout={handleLogout} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<SearchResults />} />

                <Route path="/services" element={

                  <ServiceDirectory />

                } />
                <Route path="/service-details/:id" element={
                  <ProtectedRoute role="user">
                    <ServiceDetails />
                  </ProtectedRoute>
                } />
                <Route path="/service/:id" element={
                  <ProtectedRoute role="user">
                    <ServiceTypes />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/villages" element={
                  <ProtectedRoute role="user">
                    <Villages />
                  </ProtectedRoute>} />


                <Route path="villages/:id" element={
                  <ProtectedRoute role="user">
                    <VillageDetails />
                  </ProtectedRoute>} />

                <Route path="/news" element={
                  <ProtectedRoute role="user">
                    <News />
                  </ProtectedRoute>} />

                <Route path="/news/:id" element={
                  <ProtectedRoute role="user">
                    <NewsDetails />
                  </ProtectedRoute>} />

                <Route path="/my-requests" element={
                  <ProtectedRoute role="user">
                    <MyRequests />
                  </ProtectedRoute>} />
                <Route
                  path="/my-requests/:id"
                  element={
                    <ProtectedRoute role="user">
                      <MyRequestDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute role="user">
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <ProtectedRoute role="user">
                      <Contact />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/media"
                  element={
                    <ProtectedRoute role="user">
                      <MediaCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute role="user">
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* ========== صفحات الإدمن (بدون Navbar وبدون Footer) ========== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="citizens"
            element={<CitizenServices />}
          />
          <Route path="martyrs" element={<MartyrServices />} />
          <Route path="special-needs" element={<SpecialNeedsServices />} />
          <Route path="services" element={<AdminServices />} />

          <Route
            path="requests"
            element={<AdminRequests />}
          />
          <Route
            path="profile"
            element={
              <AdminProfile />
            }
          />
          <Route
            path="site-settings"
            element={

              < AdminSiteSettings />

            }
          />
          <Route
            path="about"
            element={

              < AdminAbout />

            }
          />

          <Route path="requests/:id" element={<AdminRequestDetails />} />
          <Route path="add-person" element={<AdminAddPerson />} />
          <Route path="services-types" element={<AdminServiceTypes />} />
          <Route
            path="person-details/:type/:id"
            element={<AdminPersonDetails />}
          />
          <Route
            path="notifications"
            element={<AdminNotifications />}
          />
          <Route
            path="contact-messages"
            element={<AdminContactMessages />}
          />
          <Route
            path="/admin/qr-code"
            element={<QRCode />}
          />
          <Route path="news" element={<AdminNews />}>

            {/* الصفحة الأساسية */}
            <Route index element={<NewsList />} />

            {/* إضافة خبر */}
            <Route path="create" element={<CreateNews />} />

            {/* تعديل خبر */}
            <Route path="drafts" element={< DraftNews />} />

            {/* إدارة الوسائط */}
            <Route path="media" element={<MediaManger />} />

            <Route path="settings/villages" element={<MangeVillages />} />
            <Route path="settings/towns" element={<ManageTowns />} />
            <Route path="settings/comments" element={<MangeComments />} />


          </Route>

        </Route>
      </Routes>
    </Router>
  );

}

export default App;