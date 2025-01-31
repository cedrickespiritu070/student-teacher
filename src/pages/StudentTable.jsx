import React, { useState } from "react";
import DataTable from "react-data-table-component";
import EditStudent from "../components/EditStudent";  // Replace with the actual component for editing students
import DeleteConfirmModal from "../components/DeleteConfirmModal"; // Modal for delete confirmation

const StudentTable = () => {
  const [students, setStudents] = useState([
    { name: "John Doe", grade: "A", email: "john.doe@example.com", status: "Active" },
    { name: "Jane Smith", grade: "B", email: "jane.smith@example.com", status: "Inactive" },
    { name: "Alice Johnson", grade: "C", email: "alice.johnson@example.com", status: "Active" },
    { name: "Bob Brown", grade: "A", email: "bob.brown@example.com", status: "Active" },
    { name: "Charlie Davis", grade: "B", email: "charlie.davis@example.com", status: "Inactive" },
    { name: "Emily Clark", grade: "A", email: "emily.clark@example.com", status: "Active" },
  ]);

  const [filterText, setFilterText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.email === updatedStudent.email ? updatedStudent : s))
    );
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setStudents((prevStudents) => prevStudents.filter((s) => s.email !== studentToDelete.email));
    setIsDeleteModalOpen(false);
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Grade", selector: (row) => row.grade, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditClick(row)} className="text-primaryBlue hover:text-darkBlue">Edit</button>
          <button onClick={() => handleDeleteClick(row)} className="text-red-600 hover:text-red-800">Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredData = students.filter(
    (student) =>
      student.name.toLowerCase().includes(filterText.toLowerCase()) ||
      student.grade.toLowerCase().includes(filterText.toLowerCase()) ||
      student.email.toLowerCase().includes(filterText.toLowerCase()) ||
      student.status.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl font-semibold mb-4">Students Table</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 px-3 py-2 border rounded-md w-full sm:w-1/2 lg:w-1/4 max-w-[400px]"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Display "No results found" if there are no filtered results */}
      {filteredData.length === 0 ? (
        <p>No results found</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData.length > 0 ? filteredData : students} // Use filtered data if available, otherwise show all students
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditStudent
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          studentName={studentToDelete?.name}
        />
      )}
    </div>
  );
};

export default StudentTable;
