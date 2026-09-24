import { Routes, Route } from "react-router-dom";

import FaceAttendLanding from "./components/FaceAttendLanding";
import LoginPage from "./components/LoginPage";

import StudentDashboard from "./components/Student/StudentDashboard";
import CheckinHistory from "./components/Student/CheckinHistory";
import Faceregistration from "./components/Student/Faceregistration";
import StudentCheckin from "./components/Student/StudentCheckin";
import MyCourses from "./components/Student/MyCourses";
import Schedule from "./components/Student/Schedule";
import Profile from "./components/Student/Profile";
import Settings from "./components/Student/Settings";
import Announcements from "./components/Student/Announcements";

import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import TeacherCourses from "./components/Teacher/TeacherCourses";
import TeacherCheckinHistory from "./components/Teacher/TeacherCheckinHistory";
import TeacherAttendanceReport from "./components/Teacher/TeacherAttendanceReport";
import TeacherAttendanceScore from "./components/Teacher/TeacherAttendanceScore";
import TeacherStudents from "./components/Teacher/TeacherStudents";
import TeacherExportData from "./components/Teacher/TeacherExportData";
import TeacherProfile from "./components/Teacher/TeacherProfile";
import TeacherSettings from "./components/Teacher/TeacherSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FaceAttendLanding />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/checkin" element={<StudentCheckin />} />
      <Route path="/history" element={<CheckinHistory />} />
      <Route path="/face-registration" element={<Faceregistration />} />
      <Route path="/courses" element={<MyCourses />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/announcements" element={<Announcements />} />

      {/* Teacher */}
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher-courses" element={<TeacherCourses />} />
      <Route path="/teacher-history" element={<TeacherCheckinHistory />} />
      <Route path="/teacher-report" element={<TeacherAttendanceReport />} />
      <Route path="/teacher-scores" element={<TeacherAttendanceScore />} />
      <Route path="/teacher-students" element={<TeacherStudents />} />
      <Route path="/teacher-export" element={<TeacherExportData />} />
      <Route path="/teacher-profile" element={<TeacherProfile />} />
      <Route path="/teacher-settings" element={<TeacherSettings />} />
    </Routes>
  );
}

export default App;
