import React, { useState } from "react";
import Modal from "react-modal";
import { auth } from "../firebaseConfig"; // Import Firebase auth methods
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Firebase methods
import { toast, ToastContainer} from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons


Modal.setAppElement("#root");

const EditStudent = ({ isOpen, onClose, student, onSave }) => {
  const [editedStudent, setEditedStudent] = React.useState(student);
  const [password, setPassword] = React.useState(""); // Store current password for reauthentication
  const [newPassword, setNewPassword] = React.useState(""); // Store new password field
  const [confirmNewPassword, setConfirmNewPassword] = React.useState(""); // Confirm new password
  const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  React.useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    if (field === "newPassword") setShowNewPassword(!showNewPassword);
    if (field === "confirmNewPassword") setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      
      // Log the current password input by the user
      console.log("User current password:", password);
  
      // Check if passwords match
      if (newPassword && newPassword !== confirmNewPassword) {
        toast.error("New passwords do not match!");
        return;
      }
  
      // Re-authenticate the user with their current password before making changes
      if (newPassword) {
        if (!password) {
          toast.error("Current password is required for changes.");
          return;
        }
        
        // Log the current email for reauthentication
        console.log("User email:", user.email);
        
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        toast.success("Reauthenticated successfully!"); // Success toast for reauthentication
  
        // Log reauthentication success
        console.log("Reauthenticated successfully!");
  
        // Update the password if provided
        await updatePassword(user, newPassword);
        toast.success("Password updated successfully!"); // Success toast on password update
        console.log("Password updated successfully!");
      }
  
      // Update the email if it has changed
      if (editedStudent.email !== user.email) {
        await updateEmail(user, editedStudent.email);
        toast.success("Email updated successfully!"); // Success toast for email update
        console.log("Email updated to:", editedStudent.email);
      }
  
      // Save user data to the database (Assuming `onSave` handles saving non-auth info)
      onSave(editedStudent);
  
      // Close the modal after saving
      onClose();
      toast.success("Student information updated successfully!"); // Success toast on saving student info
  
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("You need to log in again to update your credentials.");
      } else {
        toast.error("Error updating user. Please try again."); // Error toast if something goes wrong
      }
    }
  };
  
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Student</h2>

        {/* Name Field */}
        <label className="block text-sm">Name:</label>
        <input
          type="text"
          name="username"
          value={editedStudent?.username || ""}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />

        {/* Grade Field */}
        <label className="block text-sm">Grade:</label>
        <input
          type="text"
          name="grade"
          value={editedStudent?.grade || ""}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />

        {/* Email Field */}
        <label className="block text-sm">Email:</label>
        <input
          type="email"
          name="email"
          value={editedStudent?.email || ""}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />

        {/* Status Field */}
        <label className="block text-sm">Status:</label>
        <input
          type="text"
          name="status"
          value={editedStudent?.status || ""}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />

       {/* Password Field for reauthentication */}
             <label className="block text-sm">Current Password (Required for changes):</label>
               <div className="relative">
                 <input
                   type={showPassword ? "text" : "password"}
                   name="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="border rounded-md px-3 py-2 w-full mb-2 pr-10"
                 />
                 <span className="absolute right-3 top-3 cursor-pointer" onClick={() => togglePasswordVisibility("password")}>
                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                 </span>
               </div>
       
               {/* New Password Field */}
               <label className="block text-sm">New Password (Leave blank to keep current password):</label>
               <div className="relative">
                 <input
                   type={showNewPassword ? "text" : "password"}
                   name="newPassword"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   className="border rounded-md px-3 py-2 w-full mb-2 pr-10"
                 />
                 <span className="absolute right-3 top-3 cursor-pointer" onClick={() => togglePasswordVisibility("newPassword")}>
                   {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                 </span>
               </div>
       
               {/* Confirm New Password Field */}
               <label className="block text-sm">Confirm New Password:</label>
               <div className="relative">
                 <input
                   type={showConfirmNewPassword ? "text" : "password"}
                   name="confirmNewPassword"
                   value={confirmNewPassword}
                   onChange={(e) => setConfirmNewPassword(e.target.value)}
                   className="border rounded-md px-3 py-2 w-full mb-2 pr-10"
                 />
                 <span className="absolute right-3 top-3 cursor-pointer" onClick={() => togglePasswordVisibility("confirmNewPassword")}>
                   {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                 </span>
               </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primaryBlue text-white rounded-md">Save</button>
        </div>
      </div>
      <ToastContainer/>

    </Modal>

  );

};

export default EditStudent;
