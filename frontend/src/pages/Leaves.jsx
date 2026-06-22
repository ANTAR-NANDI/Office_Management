// src/pages/Leaves.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Employee Application Form State
    const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
    
    // Administrative Review Interaction State
    const [review, setReview] = useState({ id: null, remark: "" });

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
// const userRole = localStorage.getItem("user_role");
    return (
       <div className="w-full space-y-6">
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
     {userRole === "admin" && (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
            {isAdmin ? "All Employee Leave Requests" : "My Leave History"}
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
                    {leaves.length > 0 ? (
                        leaves.map((item) => (
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
                                No leave requests found.
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