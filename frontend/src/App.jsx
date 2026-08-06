import { Routes, Route } from "react-router-dom";
import FaceAttendLanding from "./components/FaceAttendLanding";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./page/StudentDashboard";
import TeacherDashboard from "./page/TeacherDashboard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<FaceAttendLanding />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;