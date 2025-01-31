import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // To avoid accessibility warnings

const EditStudent = ({ isOpen, onClose, student, onSave }) => {
  const [editedStudent, setEditedStudent] = React.useState(student);

  React.useEffect(() => {
    setEditedStudent(student); // Update modal data when student changes
  }, [student]);

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedStudent);
    onClose(); // Close modal after saving
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
        
        {/* Name Field */}
        <label className="block text-sm">Name:</label>
        <input
          type="text"
          name="name"
          value={editedStudent?.name || ""}
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

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primaryBlue text-white rounded-md">Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditStudent;
