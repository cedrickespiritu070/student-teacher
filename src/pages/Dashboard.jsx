import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig"; // Import db from your Firebase config

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [activities, setActivities] = useState([]); // State to hold the activities
  const [notEnrolledCount, setNotEnrolledCount] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Teachers Created",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
      {
        label: "Students Created",
        data: [],
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
      },
    ],
  });
  const [selectedGrade, setSelectedGrade] = useState("All"); // State to hold selected grade
  const [selectedAnnouncementGrade, setSelectedAnnouncementGrade] = useState("All"); // State to hold selected grade

  const [announcements, setAnnouncements] = useState([]); // State for Announcements

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(db, "Users"); // Reference to 'Users' collection in Firebase Realtime Database
        const snapshot = await get(usersRef);
        const data = snapshot.val();

        if (data) {
          const teachers = Object.values(data).filter((user) => user.role === "Teacher");
          const students = Object.values(data).filter((user) => user.role === "Student");

          const enrolledStudents = students.filter((student) => student.status === "Enrolled").length;
          const notEnrolledStudents = students.filter((student) => student.status === "Not Enrolled").length;

          setTeacherCount(teachers.length);
          setStudentCount(students.length);
          setEnrolledCount(enrolledStudents);
          setNotEnrolledCount(notEnrolledStudents);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch admin notifications for recent activity
    const fetchAdminNotifications = async () => {
      try {
        const notificationsRef = ref(db, "AdminNotification"); // Reference to 'AdminNotification' node
        const snapshot = await get(notificationsRef);
        const data = snapshot.val();

        if (data) {
          const notifications = Object.values(data).map((notification) => ({
            message: notification.message,
            timestamp: notification.timestamp,
          }));

          // Sort notifications by timestamp (latest first)
          notifications.sort((a, b) => b.timestamp - a.timestamp);

          setActivities(notifications);

          // Process data for the line chart
          const labels = notifications.map((notif) => new Date(notif.timestamp).toLocaleString());
          const teachersData = notifications.filter((notif) => notif.role === "Teacher").map(() => 1);
          const studentsData = notifications.filter((notif) => notif.role === "Student").map(() => 1);

          // Update line chart data
          setLineChartData({
            labels,
            datasets: [
              {
                label: "Teachers Created",
                data: teachersData,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
              },
              {
                label: "Students Created",
                data: studentsData,
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    const fetchGeneralNotifications = async () => {
      try {
        const usersRef = ref(db, "Users"); // Reference to 'Users' collection
        const snapshot = await get(usersRef);
        const data = snapshot.val();
    
        if (data) {
          const generalNotifications = [];
    
          // Iterate over each user and gather their notifications
          Object.entries(data).forEach(([userId, user]) => {
            if (user.notifications) {
              Object.entries(user.notifications).forEach(([notifId, notification]) => {
                generalNotifications.push({
                  defaultTitle: "Student Notification",
                  title: notification.title,
                  content: notification.content,
                  username: user.username || "Unknown", // Include username
                  grade: user.grade || "Unknown", // Include grade
                  timestamp: notification.timestamp,
                  type: "user",
                });
              });
            }
          });
    
          // Sort notifications by timestamp (latest first)
          generalNotifications.sort((a, b) => b.timestamp - a.timestamp);
    
          // Fetch admin notifications
          const adminNotificationsRef = ref(db, "AdminNotification");
          const adminSnapshot = await get(adminNotificationsRef);
          const adminData = adminSnapshot.val();
    
          let adminNotifications = [];
          if (adminData) {
            adminNotifications = Object.values(adminData).map((adminNotif) => ({
              title: "Admin Notification",
              content: adminNotif.message,
              timestamp: adminNotif.timestamp,
              type: "admin",
            }));
    
            // Sort admin notifications by timestamp (latest first)
            adminNotifications.sort((a, b) => b.timestamp - a.timestamp);
          }
    
          // Combine admin and general notifications
          const combinedNotifications = [...generalNotifications, ...adminNotifications];
          setActivities(combinedNotifications);
    
          // Process data for the line chart (if needed)
          const labels = combinedNotifications.map((notif) => new Date(notif.timestamp).toLocaleString());
          const teachersData = combinedNotifications.filter((notif) => notif.type === "teacher").map(() => 1);
          const studentsData = combinedNotifications.filter((notif) => notif.type === "user").map(() => 1);
    
          // Update line chart data (if needed)
          setLineChartData({
            labels,
            datasets: [
              {
                label: "Teachers Created",
                data: teachersData,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
              },
              {
                label: "Students Created",
                data: studentsData,
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching general notifications:", error);
      }
    };
    
  
    // Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        const announcementsRef = ref(db, "Announcements"); // Reference to 'Announcements' node
        const snapshot = await get(announcementsRef);
        const data = snapshot.val();

        if (data) {
          const announcementsList = Object.values(data).map((announcement) => ({
            title: announcement.title,
            description: announcement.description,
            dateCreated: announcement.dateCreated,
            announcementDate: announcement.announcementDate,
            grade: announcement.grade,
          }));

          setAnnouncements(
            announcementsList.sort((a, b) => new Date(b.announcementDate) - new Date(a.announcementDate))
          );
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchUsers();
    fetchAdminNotifications();
    fetchAnnouncements();
    fetchGeneralNotifications();
  }, []);

  // Filter activities based on the selected grade
  // Inside the component where you filter notifications by grade
  const filteredActivities = activities.filter((activity) => {
    if (selectedGrade === "All" || !activity.grade) {
      // Show all if 'All Grades' is selected or grade is not available
      return true;
    }
    return activity.grade.includes(selectedGrade); // Filter based on grade
  });


  // Filter announcements based on selected grade
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (selectedAnnouncementGrade === "All") return true;
    return announcement.grade === selectedAnnouncementGrade;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Teachers Total</h2>
          <p className="text-3xl font-bold">{teacherCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Students Total</h2>
          <p className="text-3xl font-bold">{studentCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Enrolled</h2>
          <p className="text-3xl font-bold">{enrolledCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Not Enrolled</h2>
          <p className="text-3xl font-bold">{notEnrolledCount}</p>
        </div>
      </div>

      {/* Recent Activity, and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Section */}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Recent Activity</h2>
    <div className="flex items-center">
      <label htmlFor="grade" className="text-lg font-medium mr-2">
        Filter by Grade
      </label>
      <select
        id="grade"
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="All">All Grades</option>
        <option value="Grade 11">Grade 11</option>
        <option value="Grade 12">Grade 12</option>
      </select>
    </div>
  </div>
  <div className="max-h-96 overflow-y-scroll flex flex-col gap-4">
    {filteredActivities.length === 0 ? (
      <p className="text-gray-500 text-center">No Activities Yet</p>
    ) : (
      <ul className="space-y-4">
        {filteredActivities.map((activity, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
            <div>
              <h4 className="text-lg font-semibold">{activity.defaultTitle || "Activity"}</h4>
              <h4 className="font-semibold">{activity.title}</h4>
              <p className="text-gray-700">{activity.content}</p>
              <p className="text-xs text-gray-500">
                {activity.type === "user"
                  ? `By: ${activity.username} (${activity.grade})`
                  : "Admin"}
              </p>
            </div>
            <span className="text-xs text-gray-400 block mt-2">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


        {/* Announcements Section */}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Announcements</h2>
            <div className="flex items-center">
              <label htmlFor="announcementGrade" className="text-lg font-medium mr-2">Filter by Grade</label>
              <select
                id="announcementGrade"
                value={selectedAnnouncementGrade}
                onChange={(e) => setSelectedAnnouncementGrade(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="All">All Grades</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          </div>
          <div className="max-h-96 overflow-y-scroll flex flex-col gap-4">
            {/* Fallback message for no announcements */}
            {filteredAnnouncements.length === 0 ? (
              <p className="text-gray-500 text-center">No Announcements Yet</p>
            ) : (
              <ul className="space-y-5">
                {filteredAnnouncements.map((announcement, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-gray-700">{announcement.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Created: {announcement.dateCreated}</p>
                    <p className="text-xs text-gray-500">Announcement Date: {announcement.announcementDate}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
