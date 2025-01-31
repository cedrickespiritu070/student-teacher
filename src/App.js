import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TeacherTable from "./pages/TeacherTable";
import StudentTable from "./pages/StudentTable";
import CreateUser from "./pages/CreateUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="teacher-table" element={<TeacherTable />} />
          <Route path="student-table" element={<StudentTable />} />
          <Route path="create-user" element={<CreateUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
