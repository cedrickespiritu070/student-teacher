import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TeacherTable from "./pages/TeacherTable";
import StudentTable from "./pages/StudentTable";
import CreateUser from "./pages/CreateUser";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAnnouncement from "./pages/CreateAnnouncement";


function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page (Public) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Only accessible when logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/create-announcement" element={<CreateAnnouncement />} />
            <Route path="teacher-table" element={<TeacherTable />} />
            <Route path="student-table" element={<StudentTable />} />
            <Route path="create-user" element={<CreateUser />} />
          </Route>
        </Route>

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
