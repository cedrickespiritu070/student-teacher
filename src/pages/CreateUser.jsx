import React, { useState } from "react";
import { FaUserAlt, FaChalkboardTeacher,FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../firebaseConfig"; 
import { createUserWithEmailAndPassword, updatePassword } from "firebase/auth";
import { ref, set, push, serverTimestamp } from "firebase/database";

Modal.setAppElement("#root");

const CreateUser = () => {
  const [userType, setUserType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [grade, setGrade] = useState(""); 
  const [status, setStatus] = useState(""); // Only for students

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to handle username change and automatically set email
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value; // Allow spaces and capital letters in username
    setUsername(newUsername);
    // Automatically set email based on username (lowercase and no spaces)
    if (newUsername) {
      setEmail(`${newUsername.replace(/\s+/g, "").toLowerCase()}@commonsense.com`);
    } else {
      setEmail(""); // Clear email when username is empty
    }
  };
  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword((prev) => !prev);
    if (field === "confirmPassword") setShowConfirmPassword((prev) => !prev);
  };
  
  

  const handleCreateUser = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmCreate = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const userData = {
        username,
        email,
        role,
        password,
        grade: grade, // Save grade for both students and teachers
        status: role === "Student" ? status : "", // Status only for students
        userId: user.uid,
      };

      await set(ref(db, "Users/" + user.uid), userData);

      // Admin Notification
      const notificationMessage = `${role} user created: ${username}`;
      await push(ref(db, "AdminNotification"), {
        message: notificationMessage,
        timestamp: serverTimestamp(),
      });

      toast.success("User created successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    setUserType(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setGrade("");
    setStatus("");
  };

  const handleEditPassword = async () => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
        toast.success("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      {!userType ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create User</h2>
          <p className="mb-6">Please choose whether you are adding a Teacher or a Student.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setUserType("teacher");
                setRole("Teacher");
              }}
            >
              <FaChalkboardTeacher size={40} className="mb-4" />
              <h2 className="font-semibold text-xl">Teacher</h2>
            </div>
            <div
              className="border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setUserType("student");
                setRole("Student");
              }}
            >
              <FaUserAlt size={40} className="mb-4" />
              <h2 className="font-semibold text-xl">Student</h2>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Fill up {userType.charAt(0).toUpperCase() + userType.slice(1)} Info
            </h2>
          </div>

          {/* Role (non-editable) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full border px-4 py-2 rounded-md bg-gray-100"
            />
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange} // Update email when username changes
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-md px-3 py-2 w-full mb-2 pr-10"
              />
              <span
                className="absolute right-3 top-10  cursor-pointer "
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded-md pr-10"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Grade Dropdown (For Students and Teachers) */}
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="">Select Grade Level</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </select>
            </div>

            {/* Status Dropdown (For Students Only) */}
            {role === "Student" && (
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-4 py-2 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Not Enrolled">Not Enrolled</option>
                </select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between flex-wrap gap-4 mt-4">
            <button onClick={handleBack} className="px-4 py-2 bg-gray-400 text-white rounded-md">
              Back
            </button>
            <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={showModal} onRequestClose={handleCloseModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Confirm User Creation</h2>
          <div className="flex justify-end gap-4">
            <button onClick={handleCloseModal} className="bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
            <button onClick={handleConfirmCreate} className="bg-green-500 text-white px-4 py-2 rounded-md">Confirm</button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default CreateUser;
