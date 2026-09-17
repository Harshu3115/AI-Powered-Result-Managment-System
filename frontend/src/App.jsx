import { Routes, Route } from "react-router-dom";

// Auth
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import TeacherRegister from "./Pages/auth/TeacherRegister";
import AdminRegister from "./Pages/auth/AdminRegister";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public
import LandingPage from "./pages/LandingPage";
import Unauthorized from "./Pages/Unauthorized";

// Dashboards
import StudentDashboard from "./Pages/student/StudentDashboard";
import TeacherDashboard from "./Pages/teacher/TeacherDashboard";
import AdminDashboard from "./Pages/admin/AdminDashboard";

// Protection
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MyResults from "./pages/student/MyResults";
import PerformanceAnalysis from "./pages/student/PerformanceAnalysis";
import StudentDownloads from "./pages/student/StudentDownloads";
import SubjectAnalysis from "./pages/student/SubjectAnalysis";
import StudyPlan from "./pages/student/StudyPlan";
import AIAssistant from "./pages/student/AIAssistant";
import Rechecking from "./pages/student/Rechecking";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherEnterResults from "./pages/teacher/TeacherEnterResults";
import TeacherRechecking from "./pages/teacher/TeacherRechecking";
import TeacherReevaluation from "./pages/teacher/TeacherReevaluation.jsx";

import StudentReevaluation from "./pages/student/StudentReevaluation";
import TeacherAI from "./pages/teacher/TeacherAI.jsx";
import TeacherProfile from "./pages/teacher/TeacherProfile.jsx";
import Fabmyy from "./components/FabmyyChatbot.jsx";
import AdminStudents from "./pages/admin/AdminStudents.jsx";
import AdminTeachers from "./pages/admin/AdminTeachers.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminDepartments from "./pages/admin/AdminDepartments.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminSemesters from "./pages/admin/AdminSemesters.jsx";
import AdminSubjects from "./pages/admin/AdminSubjects.jsx";
import AdminTeacherSubject from "./pages/admin/AdminTeacherSubject.jsx";
import AdminResult from "./pages/admin/AdminResult.jsx";
import AdminRechecking from "./pages/admin/AdminRechecking.jsx";
import AdminReevaluation from "./pages/admin/AdminReevaluation.jsx";
import AdminPerformance from "./pages/admin/AdminPerformance.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminAi from "./pages/admin/AdminAi.jsx";
import AdminNotifications from "./pages/admin/AdminNotifications.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import CollegePdfSettings from "./pages/admin/CollegePdfSettings.jsx";
function App() {

  return (

    <>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/teacher-register"
          element={<TeacherRegister />}
        />

        <Route
          path="/admin-register"
          element={<AdminRegister />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />



        {/* ================= STUDENT ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            />
          }
        >
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/results"
            element={<MyResults />}
          />

          <Route
            path="/student/performance"
            element={<PerformanceAnalysis />}
          />

          <Route
            path="/student/downloads"
            element={<StudentDownloads />}
          />

          <Route
            path="/student/subjects"
            element={<SubjectAnalysis />}
          />

          <Route
            path="/student/study-plan"
            element={<StudyPlan />}
          />

          <Route
            path="/student/ai-chat"
            element={<AIAssistant />}
          />

          <Route
            path="/student/rechecking"
            element={<Rechecking />}
          />

          <Route
            path="/student/reevaluation"
            element={<StudentReevaluation />}
          />

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />
        </Route>

        {/* ================= TEACHER ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
            />
          }
        >
          <Route
            path="/teacher/dashboard"
            element={<TeacherDashboard />}
          />

          <Route
            path="/teacher/subjects"
            element={<TeacherSubjects />}
          />

          <Route
            path="/teacher/students"
            element={<TeacherStudents />}
          />

          <Route
            path="/teacher/results"
            element={<TeacherResults />}
          />

          <Route
            path="/teacher/results/enter-results"
            element={<TeacherEnterResults />}
          />

          <Route
            path="/teacher/rechecking"
            element={<TeacherRechecking />}
          />

          <Route
            path="/teacher/reevaluation"
            element={<TeacherReevaluation />}
          />

          <Route
            path="/teacher/ai"
            element={<TeacherAI />}
          />

          <Route
            path="/teacher/profile"
            element={<TeacherProfile />}
          />
        </Route>


        {/* ================= ADMIN ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            />
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/students"
            element={<AdminStudents />}
          />

          <Route
            path="/admin/teachers"
            element={<AdminTeachers />}
          />
          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />
          <Route
            path="/admin/departments"
            element={<AdminDepartments />}
          />

          <Route
            path="/admin/courses"
            element={<AdminCourses />}
          />
          <Route
            path="/admin/semesters"
            element={<AdminSemesters />}
          />
          <Route
            path="/admin/subjects"
            element={<AdminSubjects />}
          />
          <Route
            path="/admin/teacher-assignment"
            element={<AdminTeacherSubject />}
          />

          <Route
            path="/admin/results"
            element={<AdminResult />}
          />

          <Route
            path="/admin/rechecking"
            element={<AdminRechecking />}
          />
          <Route
            path="/admin/reevaluation"
            element={<AdminReevaluation />}
          />
          <Route
            path="/admin/performance"
            element={<AdminPerformance />}
          />

          <Route
            path="/admin/reports"
            element={<AdminReports />}
          />
          <Route
            path="/admin/ai"
            element={<AdminAi />}
          />

          <Route
            path="/admin/notifications"
            element={<AdminNotifications />}
          />


          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />

          <Route
            path="/admin/college-pdf-settings"
            element={<CollegePdfSettings />}
          />

        </Route>

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Fabmyy />
    </>
  );
}

export default App;