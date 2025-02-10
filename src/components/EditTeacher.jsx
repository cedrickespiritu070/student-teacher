import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Para maiwasan ang accessibility warning

const EditTeacher = ({ isOpen, onClose, teacher, onSave }) => {
  const [editedTeacher, setEditedTeacher] = React.useState(teacher);

  React.useEffect(() => {
    setEditedTeacher(teacher); // Update modal data kapag nagbago ang teacher
  }, [teacher]);

  const handleChange = (e) => {
    setEditedTeacher({ ...editedTeacher, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedTeacher);
    onClose(); // Close modal after saving
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Teacher</h2>
        
        {/* Name Field */}
        <label className="block text-sm">Name:</label>
        <input type="text" name="username" value={editedTeacher?.username || ""} onChange={handleChange} className="border rounded-md px-3 py-2 w-full mb-2" />

        {/* Title Field */}
        <label className="block text-sm">Grade:</label>
        <input type="text" name="grade" value={editedTeacher?.grade || ""} onChange={handleChange} className="border rounded-md px-3 py-2 w-full mb-2" />

        {/* Email Field */}
        <label className="block text-sm">Email:</label>
        <input type="email" name="email" value={editedTeacher?.email || ""} onChange={handleChange} className="border rounded-md px-3 py-2 w-full mb-2" />

        {/* Role Field */}
        <label className="block text-sm">Role:</label>
        <input type="text" name="role" value={editedTeacher?.role || ""} onChange={handleChange} className="border rounded-md px-3 py-2 w-full mb-2" />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primaryBlue text-white rounded-md">Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTeacher;
