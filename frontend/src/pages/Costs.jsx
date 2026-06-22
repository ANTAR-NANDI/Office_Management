import { useState, useEffect } from "react";
import api from "../api/axios";

function Costs() {
    const [costs, setCosts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: "", details: "", amount: "", date: "", employee_id: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCosts();
        fetchEmployees();
    }, []);

    const fetchCosts = async () => {
        try {
            const res = await api.get("/costs");
            setCosts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees"); // ড্রপডাউনের জন্য এমপ্লয়ি লিস্ট
            setEmployees(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/costs/add", form);
            alert("Cost recorded successfully!");
            setForm({ name: "", details: "", amount: "", date: "", employee_id: "" });
            fetchCosts();
        } catch (err) { alert("Failed to add cost record"); }
        finally { setSaving(false); }
    };

    return (
        <div className="w-full space-y-6">
            {/* Top Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Record New Cost / Expense</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Expense Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" placeholder="e.g. Office Lunch, Internet Bill" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee (Taken Money)</label>
                            <select value={form.employee_id} onChange={(e) => setForm({...form, employee_id: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm bg-white" required>
                                <option value="">Select Employee</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (BDT)</label>
                            <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Details / Description</label>
                            <textarea rows="2" value={form.details} onChange={(e) => setForm({...form, details: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" placeholder="Additional details..." />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition shadow-md cursor-pointer">
                            {saving ? "Saving..." : "Save Expense"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Expense Logs</h3>
                {loading ? <p className="text-slate-500 text-sm">Loading logs...</p> : (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 border-b">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Expense Name</th>
                                <th className="p-3 font-semibold">Taken By</th>
                                <th className="p-3 font-semibold">Amount</th>
                                <th className="p-3 font-semibold">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {costs.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-3 font-medium">{c.date}</td>
                                    <td className="p-3 text-slate-800 font-medium">{c.name}</td>
                                    <td className="p-3">{c.Employee?.name || "Unknown"}</td>
                                    <td className="p-3 font-semibold text-rose-600">৳{c.amount}</td>
                                    <td className="p-3 max-w-xs truncate">{c.details || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Costs;