import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const auth = getAuth();
  const db = getDatabase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time) {
      toast.error("All fields are required!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to create an announcement");
      return;
    }

    // Combine date and time into a single Date object
    const dateTimeString = `${date}T${time}`;
    const announcementDate = new Date(dateTimeString).toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateCreated = new Date().toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Create announcement for Grade 11
    const newAnnouncementG11 = {
      title,
      description,
      announcementDate,
      dateCreated,
      grade: "Grade 11",
      teacherId: user.uid,
    };

    // Create announcement for Grade 12
    const newAnnouncementG12 = {
      title,
      description,
      announcementDate,
      dateCreated,
      grade: "Grade 12",
      teacherId: user.uid,
    };

    try {
      // Push both Grade 11 and Grade 12 announcements to Firebase
      await push(ref(db, "Announcements"), newAnnouncementG11);
      await push(ref(db, "Announcements"), newAnnouncementG12);
      toast.success("Announcements created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
    } catch (error) {
      alert("Error creating announcement: " + error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Create Announcement
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnnouncement;
