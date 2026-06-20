function Dashboard() {
    const stats = [
        {
            title: "Total Employees",
            value: 6,
            color: "border-indigo-500",
            bg: "bg-indigo-50",
            icon: "👥"
        },
        {
            title: "Present Today",
            value: 0,
            color: "border-green-500",
            bg: "bg-green-50",
            icon: "🟢"
        },
        {
            title: "Late Arrivals",
            value: 0,
            color: "border-orange-500",
            bg: "bg-orange-50",
            icon: "⏰"
        },
        {
            title: "Absent",
            value: 6,
            color: "border-red-500",
            bg: "bg-red-50",
            icon: "🔴"
        },
    ];

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-1xl font-bold text-slate-800">
                        Dashboard Overview
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                        Last updated: 06:18:30 PM
                    </span>

                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                        Refresh
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((item, i) => (
                    <div
                        key={i}
                        className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${item.color}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.bg}`}>
                                {item.icon}
                            </div>

                            <div>
                                <p className="text-slate-500 text-sm">
                                    {item.title}
                                </p>
                                <h2 className="text-xl font-bold">
                                    {item.value}
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
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4">
                        Recent Activity
                    </h3>

                    <p className="text-slate-500 text-sm">
                        No activity today.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;