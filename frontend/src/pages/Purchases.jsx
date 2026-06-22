import { useState, useEffect } from "react";
import api from "../api/axios";

function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [form, setForm] = useState({ details: "", amount: "", buyer_name: "", date: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchPurchases(); }, []);

    const fetchPurchases = async () => {
        try {
            const res = await api.get("/purchases");
            setPurchases(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/purchases/add", form);
            alert("Purchase tracked successfully!");
            setForm({ details: "", amount: "", buyer_name: "", date: "" });
            fetchPurchases();
        } catch (err) { alert("Failed to add purchase asset"); }
        finally { setSaving(false); }
    };

    return (
        <div className="w-full space-y-6">
            {/* Top Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Track Procurement / Purchase Asset</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Purchase Title</label>
                            <input type="text" value={form.buyer_name} onChange={(e) => setForm({...form, buyer_name: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm" placeholder="Enter Title" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount</label>
                                <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm" required />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Item Purchase Details</label>
                            <textarea rows="3" value={form.details} onChange={(e) => setForm({...form, details: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm" placeholder="List items bought or purpose description..." required />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition shadow-md cursor-pointer">
                            {saving ? "Saving..." : "Record Purchase Asset"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Asset Procurement Logs</h3>
                {loading ? <p className="text-slate-500 text-sm">Loading logs...</p> : (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 border-b">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Buyer Name</th>
                                <th className="p-3 font-semibold">Purchase Details</th>
                                <th className="p-3 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {purchases.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-3 font-medium">{p.date}</td>
                                    <td className="p-3 text-slate-800 font-medium">{p.buyer_name}</td>
                                    <td className="p-3 max-w-md break-words">{p.details}</td>
                                    <td className="p-3 font-semibold text-emerald-600">৳{p.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Purchases;