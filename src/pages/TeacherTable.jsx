import React, { useState } from "react";
import DataTable from "react-data-table-component";
import EditTeacher from "../components/EditTeacher";
import DeleteConfirmModal from "../components/DeleteConfirmModal"; // Import delete modal

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([
    { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
    { name: "Courtney Henry", title: "Designer", email: "courtney.henry@example.com", role: "Admin" },
    { name: "Tom Cook", title: "Director of Product", email: "tom.cook@example.com", role: "Member" },
    { name: "Whitney Francis", title: "Copywriter", email: "whitney.francis@example.com", role: "Admin" },
    { name: "Leonard Krasner", title: "Senior Designer", email: "leonard.krasner@example.com", role: "Owner" },
    { name: "Floyd Miles", title: "Principal Designer", email: "floyd.miles@example.com", role: "Member" },
    { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
    { name: "Courtney Henry", title: "Designer", email: "courtney.henry@example.com", role: "Admin" },
    { name: "Tom Cook", title: "Director of Product", email: "tom.cook@example.com", role: "Member" },
    { name: "Whitney Francis", title: "Copywriter", email: "whitney.francis@example.com", role: "Admin" },
    { name: "Leonard Krasner", title: "Senior Designer", email: "leonard.krasner@example.com", role: "Owner" },
    { name: "Floyd Miles", title: "Principal Designer", email: "floyd.miles@example.com", role: "Member" },
  ]);

  const [filterText, setFilterText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedTeacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((t) => (t.email === updatedTeacher.email ? updatedTeacher : t))
    );
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setTeachers((prevTeachers) => prevTeachers.filter((t) => t.email !== teacherToDelete.email));
    setIsDeleteModalOpen(false);
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
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
      teacher.name.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.title.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.email.toLowerCase().includes(filterText.toLowerCase()) ||
      teacher.role.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
     <div className="flex justify-between flex-wrap">
     <h1 className="text-2xl font-semibold mb-4">Teachers Table</h1>

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
          data={filteredData.length > 0 ? filteredData : teachers} // Kung may laman ang filteredData, gamitin ito, kung wala, gamitin ang teachers
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditTeacher
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          teacher={selectedTeacher}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          teacherName={teacherToDelete?.name}
        />
      )}
    </div>
  );
};

export default TeacherTable;
