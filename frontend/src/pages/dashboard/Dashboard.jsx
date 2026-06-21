import { useEffect, useState } from "react";
import api from "../../api/axios";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        totalEmployees: 0,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
    });

    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState("");

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            const res = await api.get("/dashboard/stats");
            console.log(res);

            setDashboard(res.data);

            setLastUpdated(
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        } catch (error) {
            console.error("Dashboard stats error:", error);
        } finally {
            setLoading(false);
        }
    };
   const handleCheckIn = async () => {
    try {
        const employee_id = localStorage.getItem("user_id");

        if (!employee_id) {
            alert("User not logged in");
            return;
        }

        // Fixed: Added the missing forward slash before attendance
        const res = await api.post("/attendance/checkin", {
            employee_id,
        });

        alert("Checked In Successfully");
        fetchDashboardStats(); // Refresh stats instantly after checking in!
    } catch (err) {
        alert(err.response?.data?.message || "Check-in failed");
    }
};

    const handleCheckOut = async () => {
        try {
           const employee_id = localStorage.getItem("user_id")
           console.log(employee_id);
         if (!employee_id) {
            alert("User not logged in");
            return;
        }

            await api.post("/attendance/checkout", {
                employee_id,
            });


            alert("Checked Out Successfully");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    useEffect(() => {
        fetchDashboardStats();

        const interval = setInterval(() => {
            fetchDashboardStats();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            title: "Total Employees",
            value: dashboard.totalEmployees,
            color: "border-indigo-500",
            bg: "bg-indigo-50",
            icon: "👥",
        },
        {
            title: "Present Today",
            value: dashboard.presentCount,
            color: "border-green-500",
            bg: "bg-green-50",
            icon: "🟢",
        },
        {
            title: "Late Arrivals",
            value: dashboard.lateCount,
            color: "border-orange-500",
            bg: "bg-orange-50",
            icon: "⏰",
        },
        {
            title: "Absent",
            value: dashboard.absentCount,
            color: "border-red-500",
            bg: "bg-red-50",
            icon: "🔴",
        },
    ];

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Dashboard Overview
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                        Last updated: {lastUpdated || "--"}
                    </span>

                    <button
                        onClick={fetchDashboardStats}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item, i) => (
                    <div
                        key={i}
                        className={`bg-white p-5 rounded-xl shadow hover:shadow-md transition-all border-l-4 ${item.color}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.bg}`}>
                                <span className="text-xl">{item.icon}</span>
                            </div>

                            <div>
                                <p className="text-slate-500 text-sm">
                                    {item.title}
                                </p>

                                <h2 className="text-3xl font-bold text-slate-800">
                                    {loading ? "..." : item.value}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CHART + ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CHART */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4">
                        Weekly Attendance
                    </h3>

                    <div className="h-64 flex items-center justify-center text-slate-400 border border-dashed rounded-lg">
                        Chart Area (Recharts / Chart.js)
                    </div>
                </div>

                {/* ACTIVITY */}
                <div className="bg-white p-10 rounded-2xl shadow-md">
                        <div className="flex flex-wrap gap-8">
                            <button
                                onClick={handleCheckIn}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <span>🟢</span>
                                <span>Check In</span>
                            </button>

                            <button
                                onClick={handleCheckOut}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <span>🔴</span>
                                <span>Check Out</span>
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default Dashboard;