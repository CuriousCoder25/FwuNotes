import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Mock from "./components/mock/Mock";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Mock1 from "./components/mock/Mock1";
import Mock2 from "./components/mock/Mock2";
import Mock3 from "./components/mock/Mock3";
import Mock4 from "./components/mock/Mock4";
import About from "./components/About";
import Mock0 from "./components/mock/Mock0";
import Mock6 from "./components/mock/Mock6";
import Mock7 from "./components/mock/Mock7";
import Mock5 from "./components/mock/Mock5";
import AdmissionGuidelines from "./components/mock/AdmissionGuidelines";
import PdfUploadPage from "./components/soenotes/PdfUploadPage";
import NotesUploaded from "./components/soenotes/NotesUploaded";
import Courses from "../src/courses/Courses";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [authUser] = useAuth();
  return (
    <>
      <div className="dark:bg-slate-100 dark:text-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/notes-uploaded"
            element={authUser ? <NotesUploaded /> : <Navigate to="/signup" />}
          />
          <Route path="/Mock" element={<Mock />} />
          <Route path="/AdmissionGuidelines" element={<AdmissionGuidelines />} />
          <Route path="/Mock1" element={<Mock1 />} />
          <Route path="/Mock2" element={<Mock2 />} />
          <Route path="/Mock3" element={<Mock3 />} />
          <Route path="/Mock4" element={<Mock4 />} />
          <Route path="/Mock0" element={<Mock0 />} />
          <Route path="/Mock5" element={<Mock5 />} />
          <Route path="/Mock6" element={<Mock6 />} />
          <Route path="/Mock7" element={<Mock7 />} />
          <Route path="/About" element={<About />} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pdf-upload" element={  <ProtectedRoute> <PdfUploadPage /> </ProtectedRoute>} />
          <Route path="/notes-uploaded" element={<NotesUploaded />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
