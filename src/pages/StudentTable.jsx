import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EditStudent from "../components/EditStudent";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { ref, get, remove, set } from "firebase/database"; // Import 'set' for updating data
import { db } from "../firebaseConfig";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = ref(db, "Users");
        const snapshot = await get(studentsRef);
        const data = snapshot.val();

        if (data) {
          const studentList = Object.values(data).filter((user) => user.role === "Student");
          setStudents(studentList);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedStudent) => {
    try {
      const studentRef = ref(db, `Users/${updatedStudent.userId}`);
      await set(studentRef, updatedStudent); // Update student data in Firebase

      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.userId === updatedStudent.userId ? updatedStudent : s))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      try {
        const studentRef = ref(db, `Users/${studentToDelete.userId}`);
        await remove(studentRef);

        setStudents((prevStudents) =>
          prevStudents.filter((s) => s.userId !== studentToDelete.userId)
        );
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const columns = [
    { name: "User ID", selector: (row) => row.userId, sortable: true },
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Grade", selector: (row) => row.grade, sortable: true },
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
      student.username.toLowerCase().includes(filterText.toLowerCase()) || // Changed from username to name
      student.email.toLowerCase().includes(filterText.toLowerCase()) ||
      student.grade.toLowerCase().includes(filterText.toLowerCase()) ||
      student.status.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl font-semibold mb-4">Students Table</h1>
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 px-3 py-2 border rounded-md w-full sm:w-1/2 lg:w-1/4 max-w-[400px]"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {filteredData.length === 0 ? (
        <p>No results found</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      {isEditModalOpen && (
        <EditStudent
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          studentName={studentToDelete?.name} // Changed from username to name
        />
      )}
    </div>
  );
};

export default StudentTable;
