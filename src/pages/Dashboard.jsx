import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for the line chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Teachers Created",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
      {
        label: "Students Created",
        data: [20, 25, 10, 15, 30, 25], // Fake data for student creation
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
      },
    ],
  };

  // Recent Activity Data
  const activities = [
    { action: "Admin 1 created Teacher No. 3", time: "5 minutes ago" },
    { action: "Admin 2 created Student No. 12", time: "20 minutes ago" },
    { action: "Admin 1 updated Teacher No. 1", time: "1 hour ago" },
    { action: "Admin 3 deleted Teacher No. 5", time: "3 hours ago" },
    { action: "Admin 2 created Student No. 13", time: "4 hours ago" }, // New activity for student creation
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Teachers Total</h2>
          <p className="text-3xl font-bold">150</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Students Total</h2>
          <p className="text-3xl font-bold">500</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Placeholder 1</h2>
          <p className="text-3xl font-bold">300</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Placeholder 2</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
      </div>

      {/* Line Chart and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Teachers and Students Created Over Time</h2>
          <Line data={data} />
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-5">
            {activities.map((activity, index) => (
              <li key={index} className="text-sm text-gray-600 flex justify-between flex-wrap gap-4">
                <p>{activity.action}</p>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
