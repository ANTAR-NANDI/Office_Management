import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

// Import the PDF packages
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AttendanceDetails() {
    const { id } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🟢 Grab employee details dynamically from the payload array
    const employeeName = data[0]?.Employee?.name || `Employee #${id}`;
    const employeeDesignation = data[0]?.Employee?.designation || "";

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/attendance/details/${id}`);
            setData(res.data);
            console.log(res.data);
        } catch (error) {
            console.log("Error fetching attendance details:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (time) => {
        if (!time) return "-";

        const [hour, minute] = time.split(":");
        let h = parseInt(hour);
        const ampm = h >= 12 ? "PM" : "AM";

        h = h % 12;
        if (h === 0) h = 12;

        return `${h}:${minute} ${ampm}`;
    };

    const exportToPDF = () => {
        if (data.length === 0) {
            alert("No data available to export.");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        // Add Document Title Header Text (With actual employee name)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Attendance Report: ${employeeName}`, 14, 20);

        // Add Employee Designation details underneath
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        if (employeeDesignation) {
            doc.text(`Designation: ${employeeDesignation}`, 14, 26);
        }
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

        // Map data
        const tableRows = data.map((item) => [
            item.date,
            formatTime(item.check_in),  
            formatTime(item.check_out), 
            item.duration || "N/A",
            item.status
        ]);

        const tableHeaders = ["Date", "Check In", "Check Out", "Duration", "Status"];

        // Call autoTable directly and pass 'doc' as the first parameter
        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: 38, // Shifted down slightly to avoid text collision
            theme: "striped", 
            headStyles: { 
                fillColor: [15, 23, 42], 
                textColor: [255, 255, 255], 
                fontStyle: "bold" 
            },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                4: { fontStyle: "bold" } 
            }
        });

        // Trigger save file download using the actual name string
        doc.save(`Attendance_${employeeName.replace(/\s+/g, "_")}.pdf`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            
            {/* HEADER TRACK LAYER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    {/* 🟢 Displays actual name string dynamically */}
                    <h2 className="text-2xl font-bold text-slate-800">
                        Attendance Record: {loading ? "..." : employeeName}
                    </h2>
                    {employeeDesignation && (
                        <p className="text-sm text-slate-500 mt-1">
                            Designation: {employeeDesignation}
                        </p>
                    )}
                </div>
                
                {/* Render the Export Trigger Button Element */}
                {!loading && data.length > 0 && (
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
                    >
                        <span>📄</span> Export PDF
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="p-2 border text-left">Date</th>
                            <th className="p-2 border text-left">Check In</th>
                            <th className="p-2 border text-left">Check Out</th>
                            <th className="p-2 border text-left">Duration</th>
                            <th className="p-2 border text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition border-b">
                                    <td className="p-2 border text-slate-700">{item.date}</td>
                                    <td className="p-2 border text-slate-600">{formatTime(item.check_in)}</td>
                                    <td className="p-2 border text-slate-600">{formatTime(item.check_out)}</td>
                                    <td className="p-2 border text-slate-600">{item.duration}</td>
                                    <td className="p-2 border font-medium">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-slate-400 p-8">
                                    No attendance found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AttendanceDetails;