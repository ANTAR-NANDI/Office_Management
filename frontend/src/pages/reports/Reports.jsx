import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Reports() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [filters, setFilters] = useState({
        from: "",
        to: "",
        employee_id: ""
    });

    useEffect(() => {
        fetchEmployees();
        fetchReports();
    }, []);

    const fetchEmployees = async () => {
        const res = await api.get("/employees");
        setEmployees(res.data);
    };

    const fetchReports = async () => {
        const res = await api.get("/attendance/report", {
            params: filters
        });

        setData(res.data);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">

            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    Attendance Reports
                </h2>
                <p className="text-slate-500">
                    Employee wise attendance summary
                </p>
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                <input
                    type="date"
                    value={filters.from}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            from: e.target.value
                        })
                    }
                    className="border p-3 rounded-lg"
                />

                <input
                    type="date"
                    value={filters.to}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            to: e.target.value
                        })
                    }
                    className="border p-3 rounded-lg"
                />

                <select
                    value={filters.employee_id}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            employee_id: e.target.value
                        })
                    }
                    className="border p-3 rounded-lg"
                >
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={fetchReports}
                    className="bg-cyan-600 text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* TABLE */}
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left">Employee</th>
                        <th className="p-3 text-left">Designation</th>
                        <th className="p-3 text-center">Present</th>
                        <th className="p-3 text-center">Late</th>
                        <th className="p-3 text-center">Absent</th>
                        <th className="p-3 text-center">Details</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => (
                        <tr key={item.employee_id} className="border-b">

                            <td className="p-3">
                                {item.employee_name}
                            </td>

                            <td className="p-3">
                                {item.designation}
                            </td>

                            <td className="p-3 text-center text-green-600 font-semibold">
                                {item.total_present}
                            </td>

                            <td className="p-3 text-center text-yellow-600 font-semibold">
                                {item.total_late}
                            </td>

                            <td className="p-3 text-center text-red-600 font-semibold">
                                {item.total_absent}
                            </td>

                            <td className="p-3 text-center">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/attendance-details/${item.employee_id}`
                                        )
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Details
                                </button>

                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default Reports;