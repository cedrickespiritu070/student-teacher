import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, teacherName }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete <strong>{teacherName}</strong>?</p>
        
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
