import React, { useState } from "react";
import { FaUserAlt, FaChalkboardTeacher } from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const CreateUser = () => {
  const [userType, setUserType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreateUser = () => {
    setShowModal(true);
  };

  const handleConfirmCreate = () => {
    // Assuming the form is valid and successful creation.
    toast.success("User created successfully!");
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    setUserType(null); // Go back to user selection page
  };

  return (
    <div className="p-6">
      {/* Step 1: User Type Selection */}
      {!userType ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create User</h2>
          <p className="mb-6">Please choose whether you are adding a Teacher or a Student.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={() => setUserType("teacher")}
            >
              <FaChalkboardTeacher size={40} className="mb-4" />
              <h2 className="font-semibold text-xl">Teacher</h2>
            </div>
            <div
              className="border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={() => setUserType("student")}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full border px-4 py-2 rounded-md" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full border px-4 py-2 rounded-md" />
            </div>

            {/* Additional Fields */}
            {userType === "teacher" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input type="text" className="w-full border px-4 py-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree</label>
                  <input type="text" className="w-full border px-4 py-2 rounded-md" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Grade</label>
                  <input type="text" className="w-full border px-4 py-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">School</label>
                  <input type="text" className="w-full border px-4 py-2 rounded-md" />
                </div>
              </>
            )}
          </div>

          {/* Create Button */}
          <div className="flex justify-between flex-wrap gap-4 mt-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Back
            </button>
            <button
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-md shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Are you sure you want to create this user?</h2>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCloseModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmCreate}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Container for success message */}
      <ToastContainer />
    </div>
  );
};

export default CreateUser;
