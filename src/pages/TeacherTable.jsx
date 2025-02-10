import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EditTeacher from "../components/EditTeacher";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { ref, get, remove, set } from "firebase/database"; // Import 'set' for updating data
import { db } from "../firebaseConfig";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersRef = ref(db, "Users");
        const snapshot = await get(teachersRef);
        const data = snapshot.val();

        if (data) {
          const teacherList = Object.values(data).filter((user) => user.role === "Teacher");
          setTeachers(teacherList);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedTeacher) => {
    try {
      const teacherRef = ref(db, `Users/${updatedTeacher.userId}`);
      await set(teacherRef, updatedTeacher); // Update teacher data in Firebase

      setTeachers((prevTeachers) =>
        prevTeachers.map((t) => (t.userId === updatedTeacher.userId ? updatedTeacher : t))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teacherToDelete) {
      try {
        const teacherRef = ref(db, `Users/${teacherToDelete.userId}`);
        await remove(teacherRef);

        setTeachers((prevTeachers) =>
          prevTeachers.filter((t) => t.userId !== teacherToDelete.userId)
        );
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  const columns = [
    { name: "User ID", selector: (row) => row.userId, sortable: true },
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Grade", selector: (row) => row.grade, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
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

  const filteredData = teachers.filter(
    (teacher) =>
      teacher.username.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.email.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.grade.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.role.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-2xl font-semibold mb-4">Teachers Table</h1>
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
        <EditTeacher
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          teacher={selectedTeacher}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          teacherName={teacherToDelete?.username}
        />
      )}
    </div>
  );
};

export default TeacherTable;
