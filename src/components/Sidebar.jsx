import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setisLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    setisLogoutOpen(false);
    localStorage.removeItem("isAuthenticated"); // Remove session
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setisLogoutOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  return (
    <div
      className={`h-auto bg-primaryBlue text-white transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64 items-start" : "w-16 items-center"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center p-4 w-full">
        <div
          className={`flex items-center w-full ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarOpen && <span className="ml-3">Logo Here</span>}
          <span>
            <i
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bi bi-list text-2xl cursor-pointer"
            ></i>
          </span>
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-5 flex flex-col gap-2 w-full">
        <Link to="/" className="block w-full">
          <div
            className={`flex items-center p-3 w-full ${
              location.pathname === "/"
                ? "text-lightBlue bg-darkBlue"
                : "hover:bg-darkBlue"
            } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
          >
            <i className="bi bi-house-door text-lg"></i>
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
        </Link>

        <Link to="/teacher-table" className="block w-full">
          <div
            className={`flex items-center p-3 w-full ${
              location.pathname === "/teacher-table"
                ? "text-lightBlue bg-darkBlue"
                : "hover:bg-darkBlue"
            } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
          >
            <i className="bi bi-person-lines-fill text-lg"></i>
            {isSidebarOpen && <span className="ml-3">Teacher Table</span>}
          </div>
        </Link>

        <Link to="/student-table" className="block w-full">
          <div
            className={`flex items-center p-3 w-full ${
              location.pathname === "/student-table"
                ? "text-lightBlue bg-darkBlue"
                : "hover:bg-darkBlue"
            } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
          >
            <i className="bi bi-person-badge text-lg"></i>
            {isSidebarOpen && <span className="ml-3">Student Table</span>}
          </div>
        </Link>

        <Link to="/create-user" className="block w-full">
          <div
            className={`flex items-center p-3 w-full ${
              location.pathname === "/create-user"
                ? "text-lightBlue bg-darkBlue"
                : "hover:bg-darkBlue"
            } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
          >
            <i className="bi bi-person-plus text-lg"></i>
            {isSidebarOpen && <span className="ml-3">Create User</span>}
          </div>
        </Link>

        <div
          className={`p-3 hover:bg-darkBlue cursor-pointer w-full flex ${
            isSidebarOpen ? "justify-start" : "justify-center"
          }`}
          onClick={handleLogoutClick}
        >
          <i className="bi bi-box-arrow-in-right text-lg"></i>
          {isSidebarOpen && <span className="ml-3">Logout</span>}
        </div>
      </nav>

      {/* Confirmation Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleLogoutConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
              <button
                onClick={handleLogoutCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
