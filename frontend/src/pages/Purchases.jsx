import { useState, useEffect } from "react";
import api from "../api/axios";

// 🟢 PDF এক্সপোর্ট প্যাকেজ ইম্পোর্ট করা হলো
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [employees, setEmployees] = useState([]); 
    const [form, setForm] = useState({ details: "", amount: "", employee_id: "", date: "" }); 
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🟢 ফিল্টার স্টেটস (Date & Employee Filters State)
    const [filterEmployeeId, setFilterEmployeeId] = useState(""); // 🟢 নতুন এমপ্লয়ি ফিল্টার স্টেট
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");

    useEffect(() => { 
        fetchPurchases(); 
        fetchEmployees(); 
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await api.get("/purchases");
            setPurchases(res.data);
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
            await api.post("/purchases/add", form);
            alert("Purchase tracked successfully!");
            setForm({ details: "", amount: "", employee_id: "", date: "" });
            fetchPurchases();
        } catch (err) { alert("Failed to add purchase asset"); }
        finally { setSaving(false); }
    };

    // 🟢 ১. ক্লায়েন্ট-সাইড মাল্টিপল ফিল্টারিং লজিক (Live Interactive Filtering)
    const filteredPurchases = purchases.filter((item) => {
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

    // 🟢 ২. ফিল্টার করা ডাটার সর্বমোট হিসেব বের করা (Total Sum Calculation)
    const totalAmount = filteredPurchases.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0);
    }, 0);

    // 🟢 ③. PDF রিপোর্ট জেনারেট এবং ডাউনলোড করার ফাংশন
    const exportToPDF = () => {
        if (filteredPurchases.length === 0) {
            alert("No filtered data available to export.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        // ডকুমেন্ট হেডার ও টাইটেল
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Asset Procurement / Purchase Report", 14, 20);

        // মেটাডেটা বা জেনারেশন টাইমস্ট্যাম্প
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
        
        if (filterFromDate || filterToDate) {
            doc.text(`Date Range: ${filterFromDate || "Any"} to ${filterToDate || "Any"}`, 14, 31);
        }

        // টেবিল ডাটা প্রিপারেশন
        const tableRows = filteredPurchases.map((item) => [
            item.date,
            item.Employee?.name || "Unknown", 
            item.details,
            `Tk ${parseFloat(item.amount).toFixed(2)}`
        ]);

        // ফুটার রো যুক্ত করা (Total Row)
        tableRows.push([
            "", 
            "", 
            "Total Summary Amount:", 
            `Tk ${totalAmount.toFixed(2)}`
        ]);

        const tableHeaders = ["Date", "Purchased By", "Purchase Details", "Amount"];

        // autoTable জেনারেটর কল
        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: filterFromDate || filterToDate ? 36 : 32,
            theme: "striped",
            headStyles: {
                fillColor: [5, 150, 105], // Emerald-600 থিম কালার পলিসি
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            styles: { fontSize: 10, cellPadding: 3 },
            didParseCell: (data) => {
                if (data.row.index === tableRows.length - 1) {
                    data.cell.styles.fontStyle = "bold";
                    if (data.column.index === 3) {
                        data.cell.styles.textColor = [5, 150, 105]; // Total amount green text
                    }
                }
            }
        });

        doc.save(`Purchase_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    return (
        <div className="w-full space-y-6">
            {/* Top Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Track Procurement / Purchase Asset</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee (Who Bought It)</label>
                            <select 
                                name="employee_id"
                                value={form.employee_id} 
                                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount</label>
                                <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Item Purchase Details</label>
                            <textarea rows="3" value={form.details} onChange={(e) => setForm({...form, details: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="List items bought or purpose description..." required />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition shadow-md cursor-pointer">
                            {saving ? "Saving..." : "Record Purchase Asset"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 🟢 FILTER & ACTIONS CONTROL LAYER BAR (আপডেটেড মাল্টিপল ফিল্টার বার) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    
                    {/* 🟢 নতুন ফিল্টার: এমপ্লয়ি ড্রপডাউন ফিল্টার */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Filter By Employee</label>
                        <select
                            value={filterEmployeeId}
                            onChange={(e) => setFilterEmployeeId(e.target.value)}
                            className="w-full border border-slate-200 p-2 text-xs rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">All Employees</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">From Date</label>
                        <input
                            type="date"
                            value={filterFromDate}
                            onChange={(e) => setFilterFromDate(e.target.value)}
                            className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">To Date</label>
                        <input
                            type="date"
                            value={filterToDate}
                            onChange={(e) => setFilterToDate(e.target.value)}
                            className="w-full border border-slate-200 p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* PDF Export Button */}
                {!loading && purchases.length > 0 && (
                    <button
                        onClick={exportToPDF}
                        className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 h-fit cursor-pointer whitespace-nowrap justify-center select-none"
                    >
                        <span>📄</span> Export PDF Report
                    </button>
                )}
            </div>

            {/* Bottom Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                    Asset Procurement Logs
                    {filteredPurchases.length !== purchases.length && (
                        <span className="text-xs font-normal text-emerald-600 ml-2">
                            (Filtered: showing {filteredPurchases.length} of {purchases.length})
                        </span>
                    )}
                </h3>
                {loading ? <p className="text-slate-500 text-sm">Loading logs...</p> : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 border-b">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Purchased By</th> 
                                <th className="p-3 font-semibold">Purchase Details</th>
                                <th className="p-3 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {filteredPurchases.length > 0 ? (
                                <>
                                    {filteredPurchases.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-3 font-medium">{p.date}</td>
                                            <td className="p-3 text-slate-800 font-medium">{p.Employee?.name || "Unknown"}</td> 
                                            <td className="p-3 max-w-md break-words">{p.details}</td>
                                            <td className="p-3 font-semibold text-emerald-600">৳{parseFloat(p.amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {/* টোটাল সাম ফুটার রো */}
                                    <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
                                        <td className="p-3"></td>
                                        <td className="p-3"></td>
                                        <td className="p-3 text-right text-slate-700">Total Summary Amount:</td>
                                        <td className="p-3 text-emerald-700 text-base">৳{totalAmount.toFixed(2)}</td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-slate-400">
                                        No asset logs found matching the filters.
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

export default Purchases;