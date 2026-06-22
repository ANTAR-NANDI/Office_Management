// src/pages/Leaves.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

// PDF এক্সপোর্ট প্যাকেজ ইম্পোর্ট করা হলো
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Employee Application Form State
    const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
    
    // Administrative Review Interaction State
    const [review, setReview] = useState({ id: null, remark: "" });

    // 🟢 ফিল্টার স্টেস (Filters State)
    const [filterEmployee, setFilterEmployee] = useState("");
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");

    const userRole = localStorage.getItem("user_role");
    const currentUserId = localStorage.getItem("user_id");
    const isAdmin = userRole === "admin";

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get("/leaves");
            setLeaves(res.data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!form.start_date || !form.end_date || !form.reason) return alert("Please fill all inputs");
        setSaving(true);

        try {
            await api.post("/leaves/apply", {
                employee_id: currentUserId,
                ...form
            });
            alert("Application submitted successfully!");
            setForm({ start_date: "", end_date: "", reason: "" });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || "Application submission failed");
        } finally {
            setSaving(false);
        }
    };

    const handleAdminAction = async (id, statusAction) => {
        if (statusAction === "Declined" && !review.remark.trim()) {
            return alert("Please enter a reason/remark for declining this leave.");
        }

        try {
            await api.put(`/leaves/review/${id}`, {
                status: statusAction,
                admin_remark: review.remark
            });
            alert(`Application ${statusAction} successfully!`);
            setReview({ id: null, remark: "" });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || "Review action failed");
        }
    };

    // 🟢 ১. ক্লায়েন্ট-সাইড ফিল্টারিং লজিক (Instant Live Filtering)
    const filteredLeaves = leaves.filter((item) => {
        // এমপ্লয়ি নাম ফিল্টার (শুধু এডমিনের জন্য প্রযোজ্য)
        const matchEmployee = isAdmin 
            ? item.Employee?.name?.toLowerCase().includes(filterEmployee.toLowerCase())
            : true;

        // ডেট ফিল্টার (start_date ফিল্টার রেঞ্জের মধ্যে আছে কিনা)
        const itemDate = item.start_date; // YYYY-MM-DD format
        const matchFrom = filterFromDate ? itemDate >= filterFromDate : true;
        const matchTo = filterToDate ? itemDate <= filterToDate : true;

        return matchEmployee && matchFrom && matchTo;
    });

    // 🟢 ২. PDF জেনারেট এবং এক্সপোর্ট ফাংশন
    const exportToPDF = () => {
        if (filteredLeaves.length === 0) {
            alert("No filtered data available to export.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        // ডকুমেন্ট টাইটেল হেডার টেক্সট
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Employee Leave Requests Report", 14, 20);

        // জেনারেট হওয়ার মেটাডেটা টাইমস্ট্যাম্প
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
        if (filterFromDate || filterToDate) {
            doc.text(`Filter Range: ${filterFromDate || "Any"} to ${filterToDate || "Any"}`, 14, 31);
        }

        // টেবিল রো ডাটা প্রিপারেশন
        const tableRows = filteredLeaves.map((item) => [
            isAdmin ? item.Employee?.name || "N/A" : "My Account",
            `${item.start_date} to ${item.end_date}`,
            item.reason,
            item.status,
            item.admin_remark || "—"
        ]);

        const tableHeaders = ["Employee Name", "Duration Dates", "Reason", "Status", "Admin Remark"];

        // autoTable এর মাধ্যমে গ্রিড রেন্ডার
        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: filterFromDate || filterToDate ? 36 : 32,
            theme: "striped",
            headStyles: {
                fillColor: [15, 23, 42], // Slate-900 থিম কালার
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            styles: { fontSize: 9, cellPadding: 3 }
        });

        // ফাইল ডাউনলোড ট্রিগার
        doc.save(`Leave_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    return (
        <div className="w-full space-y-6">
            
            {/* TOP MODULE TRACK: APPLICATION SUBMISSION (Full Width Form) */}
            {userRole !== "admin" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Apply for Leave</h3>
                    <form onSubmit={handleApplySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={form.start_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={form.end_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Reason Description</label>
                            <textarea
                                name="reason"
                                rows="3"
                                value={form.reason}
                                onChange={handleInputChange}
                                className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                                placeholder="Explain your reason for leave request..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-6 rounded-xl transition cursor-pointer text-sm shadow-md"
                            >
                                {saving ? "Submitting..." : "Submit Leave Request"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 🟢 FILTER & ACTIONS CONTROL LAYER BAR (নতুন ফিল্টার ও পিডিএফ বাটন সেকশন) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    {/* এমপ্লয়ি সার্চ ফিল্টার (শুধুমাত্র এডমিন দেখতে পাবে) */}
                    {isAdmin && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Search Employee</label>
                            <input
                                type="text"
                                placeholder="Type name to search..."
                                value={filterEmployee}
                                onChange={(e) => setFilterEmployee(e.target.value)}
                                className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">From Date</label>
                        <input
                            type="date"
                            value={filterFromDate}
                            onChange={(e) => setFilterFromDate(e.target.value)}
                            className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">To Date</label>
                        <input
                            type="date"
                            value={filterToDate}
                            onChange={(e) => setFilterToDate(e.target.value)}
                            className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                </div>

                {/* PDF Export Button */}
                {!loading && leaves.length > 0 && (
                    <button
                        onClick={exportToPDF}
                        className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 h-fit cursor-pointer whitespace-nowrap justify-center"
                    >
                        <span>📄</span> Export PDF Report
                    </button>
                )}
            </div>

            {/* BOTTOM MODULE TRACK: DATA VIEW LIST (Full Width Table Below) */}
            {(userRole === "admin" || userRole !== "admin") && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {isAdmin ? "All Employee Leave Requests" : "My Leave History"}
                        {filteredLeaves.length !== leaves.length && (
                            <span className="text-xs font-normal text-cyan-600 ml-2">
                                (Filtered: showing {filteredLeaves.length} of {leaves.length})
                            </span>
                        )}
                    </h3>

                    {loading ? (
                        <p className="text-slate-500 text-sm">Loading applications history logs...</p>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-700 border-b border-slate-100">
                                    {isAdmin && <th className="p-3 font-semibold">Employee</th>}
                                    <th className="p-3 font-semibold">Duration Dates</th>
                                    <th className="p-3 font-semibold">Reason</th>
                                    <th className="p-3 font-semibold">Status</th>
                                    <th className="p-3 font-semibold text-center">Actions / Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                {filteredLeaves.length > 0 ? (
                                    filteredLeaves.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                                            {isAdmin && (
                                                <td className="p-3 font-medium text-slate-800">
                                                    {item.Employee?.name}
                                                    <span className="block text-xs text-slate-400 font-normal">{item.Employee?.designation}</span>
                                                </td>
                                            )}
                                            <td className="p-3 whitespace-nowrap text-xs">
                                                <span className="font-medium text-slate-700">{item.start_date}</span>
                                                <span className="text-slate-400 mx-1">to</span>
                                                <span className="font-medium text-slate-700">{item.end_date}</span>
                                            </td>
                                            <td className="p-3 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    item.status === "Approved" ? "bg-green-50 text-green-700" :
                                                    item.status === "Declined" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {item.status === "Pending" && isAdmin ? (
                                                    // Admin decision actions panel
                                                    <div className="flex flex-col sm:flex-row gap-2 items-center justify-center min-w-[220px]">
                                                        <input
                                                            type="text"
                                                            placeholder="Decline reason comment..."
                                                            value={review.id === item.id ? review.remark : ""}
                                                            onChange={(e) => setReview({ id: item.id, remark: e.target.value })}
                                                            className="border border-slate-200 p-2 text-xs rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                        />
                                                        <div className="flex gap-1 shrink-0">
                                                            <button
                                                                onClick={() => handleAdminAction(item.id, "Approved")}
                                                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleAdminAction(item.id, "Declined")}
                                                                className="bg-red-500 hover:bg-red-700 text-white text-xs px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer"
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Static Display for finalized reviews or standard employee view
                                                    <p className="text-xs text-slate-500 italic text-center max-w-[180px] truncate" title={item.admin_remark}>
                                                        {item.admin_remark ? `Remark: ${item.admin_remark}` : "—"}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? 5 : 4} className="text-center p-8 text-slate-400">
                                            No leave requests found matching the active filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

        </div>
    );
}

export default Leaves;