import { useState, useEffect } from "react";
import api from "../api/axios";

// 🟢 PDF এক্সপোর্ট প্যাকেজ ইম্পোর্ট করা হলো
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Costs() {
    const [costs, setCosts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: "", details: "", amount: "", date: "", employee_id: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🟢 ফিল্টার স্টেটস (Filters State)
    const [filterEmployeeId, setFilterEmployeeId] = useState("");
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");

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
            const res = await api.get("/employees"); 
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

    // 🟢 ১. ক্লায়েন্ট-সাইড ফিল্টারিং লজিক (Live Interactive Filtering)
    const filteredCosts = costs.filter((item) => {
        // এমপ্লয়ি ফিল্টার ম্যাচিং চেক
        const matchEmployee = filterEmployeeId 
            ? String(item.employee_id) === String(filterEmployeeId)
            : true;

        // ডেট ফিল্টার ম্যাচিং চেক
        const itemDate = item.date; // Format: YYYY-MM-DD
        const matchFrom = filterFromDate ? itemDate >= filterFromDate : true;
        const matchTo = filterToDate ? itemDate <= filterToDate : true;

        return matchEmployee && matchFrom && matchTo;
    });

    // 🟢 ২. ফিল্টার করা খরচের সর্বমোট হিসেব বের করা (Total Sum Calculation)
    const totalAmount = filteredCosts.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0);
    }, 0);

    // 🟢 ৩. PDF জেনারেট এবং ডাউনলোড করার ফাংশন (ফুটার সাম সহ)
    const exportToPDF = () => {
        if (filteredCosts.length === 0) {
            alert("No filtered data available to export.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        // ডকুমেন্ট হেডার ও টাইটেল সেট করা
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Expense / Cost Logs Report", 14, 20);

        // মেটাডেটা বা জেনারেশন টাইমস্ট্যাম্প
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
        
        if (filterFromDate || filterToDate) {
            doc.text(`Date Range: ${filterFromDate || "Any"} to ${filterToDate || "Any"}`, 14, 31);
        }

        // টেবিল ডাটা প্রিপারেশন (শুধুমাত্র ফিল্টার করা ডাটা প্রিন্ট হবে)
        const tableRows = filteredCosts.map((item) => [
            item.date,
            item.name,
            item.Employee?.name || "Unknown",
            `Tk ${parseFloat(item.amount).toFixed(2)}`,
            item.details || "—"
        ]);

        // PDF টেবিলের নিচেও Total Summary Row পুশ করা হলো
        tableRows.push([
            "",
            "",
            "Total Summary Amount:",
            `Tk ${totalAmount.toFixed(2)}`,
            ""
        ]);

        const tableHeaders = ["Date", "Expense Name", "Taken By", "Amount", "Details / Remarks"];

        // autoTable জেনারেটর কল করা
        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: filterFromDate || filterToDate ? 36 : 32,
            theme: "striped",
            headStyles: {
                fillColor: [15, 23, 42], // Slate-900 থিম কালার পলিসি
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            styles: { fontSize: 10, cellPadding: 3 },
            // PDF ফাইলে লাস্ট রো বা ফুটার সাম রো টিকে বোল্ড এবং হাইলাইট করার জন্য কন্ডিশনাল স্টাইলিং
            didParseCell: (data) => {
                if (data.row.index === tableRows.length - 1) {
                    data.cell.styles.fontStyle = "bold";
                    if (data.column.index === 3) {
                        data.cell.styles.textColor = [225, 29, 72]; // rose-600 কালার কোড
                    }
                }
            }
        });

        // ব্রাউজারে ফাইল ডাউনলোড ট্রিগার করা হলো
        doc.save(`Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`);
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
                            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Office Lunch, Internet Bill" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee (Taken Money)</label>
                            <select value={form.employee_id} onChange={(e) => setForm({...form, employee_id: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required>
                                <option value="">Select Employee</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (BDT)</label>
                            <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Details / Description</label>
                            <textarea rows="2" value={form.details} onChange={(e) => setForm({...form, details: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Additional details..." />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition shadow-md cursor-pointer">
                            {saving ? "Saving..." : "Save Expense"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Table Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                    Expense Logs
                    {filteredCosts.length !== costs.length && (
                        <span className="text-xs font-normal text-cyan-600 ml-2">
                            (Filtered: showing {filteredCosts.length} of {costs.length})
                        </span>
                    )}
                </h3>
                
                {/* FILTER & ACTIONS CONTROL LAYER BAR */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                        {/* এমপ্লয়ি ফিল্টার ড্রপডাউন */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Filter By Employee</label>
                            <select
                                value={filterEmployeeId}
                                onChange={(e) => setFilterEmployeeId(e.target.value)}
                                className="w-full border border-slate-200 p-2 text-xs rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">All Employees</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                        
                        {/* From Date ফিল্টার */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">From Date</label>
                            <input
                                type="date"
                                value={filterFromDate}
                                onChange={(e) => setFilterFromDate(e.target.value)}
                                className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* To Date ফিল্টার */}
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
                    {!loading && costs.length > 0 && (
                        <button
                            onClick={exportToPDF}
                            className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 h-fit cursor-pointer whitespace-nowrap justify-center"
                        >
                            <span>📄</span> Export PDF Report
                        </button>
                    )}
                </div>

                {loading ? <p className="text-slate-500 text-sm">Loading logs...</p> : (
                    <table className="w-full text-left text-sm border-collapse">
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
                            {filteredCosts.length > 0 ? (
                                <>
                                    {filteredCosts.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-3 font-medium">{c.date}</td>
                                            <td className="p-3 text-slate-800 font-medium">{c.name}</td>
                                            <td className="p-3">{c.Employee?.name || "Unknown"}</td>
                                            <td className="p-3 font-semibold text-rose-600">৳{parseFloat(c.amount).toFixed(2)}</td>
                                            <td className="p-3 max-w-xs truncate" title={c.details}>{c.details || "—"}</td>
                                        </tr>
                                    ))}
                                    {/* 🟢 ৪. টেবিলের নিচে সর্বমোট হিসেবের ফুটার রো যুক্ত করা হলো (Total Sum Table Footer) */}
                                    <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
                                        <td className="p-3"></td>
                                        <td className="p-3"></td>
                                        <td className="p-3 text-right text-slate-700">Total Summary Amount:</td>
                                        <td className="p-3 text-rose-600 text-base">৳{totalAmount.toFixed(2)}</td>
                                        <td className="p-3"></td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-8 text-slate-400">
                                        No expense logs found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Costs;