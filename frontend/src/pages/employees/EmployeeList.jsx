import { useEffect, useState } from "react";
import api from "../../api/axios";

function EmployeeList() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    salary: "",
    password: "",
    type: "",
});

    useEffect(() => {
        fetchEmployees();
    }, []);

    // ---------------- FETCH ----------------
    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees");
            setEmployees(res.data);
        } catch (error) {
            console.log("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- OPEN CREATE MODAL ----------------
    const openCreateModal = () => {
        setEditEmployee(null);
        setForm({
            name: "",
            email: "",
            phone: "",
            designation: "",
            salary: "",
        });
        setIsModalOpen(true);
    };

    // ---------------- OPEN EDIT MODAL ----------------
    const openEditModal = (employee) => {
        setEditEmployee(employee);
        setForm({
            name: employee.name || "",
            email: employee.email || "",
            phone: employee.phone || "",
            designation: employee.designation || "",
            salary: employee.salary || "",
        });
        setIsModalOpen(true);
    };

    // ---------------- SUBMIT (CREATE + UPDATE) ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editEmployee) {
                await api.put(
                    `/employees/update/${editEmployee.id}`,
                    form
                );
            } else {
                await api.post("/employees/create", form);
            }

            setIsModalOpen(false);
            fetchEmployees();

        } catch (error) {
            console.log("Save error:", error);
        }
    };

    // ---------------- DELETE ----------------
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/employees/delete/${id}`);
            fetchEmployees();
        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Employee List
                    </h2>
                </div>

                <button
                    onClick={openCreateModal}
                    className="cursor bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-xl"
                >
                    Add Employee
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                {loading ? (
                    <p className="text-center py-6 text-slate-500">
                        Loading employees...
                    </p>
                ) : (
                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="bg-slate-100">
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Designation</th>
                                <th className="p-3 text-left">Salary</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((employee, index) => (
                                <tr
                                    key={employee.id}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="p-3">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        {employee.name}
                                    </td>

                                    <td className="p-3">
                                        {employee.email}
                                    </td>

                                    <td className="p-3">
                                        {employee.phone}
                                    </td>

                                    <td className="p-3">
                                        {employee.designation}
                                    </td>

                                    <td className="p-3">
                                        ৳ {employee.salary}
                                    </td>

                                    <td className="p-3 text-center">

                                        <button
                                            onClick={() => openEditModal(employee)}
                                            className="cursor bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="cursor bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl">

                        <h2 className="text-xl font-bold mb-4">
                            {editEmployee ? "Edit Employee" : "Add Employee"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                placeholder="Name"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                placeholder="Email"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                placeholder="Phone"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={form.designation}
                                onChange={(e) =>
                                    setForm({ ...form, designation: e.target.value })
                                }
                                placeholder="Designation"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={form.salary}
                                onChange={(e) =>
                                    setForm({ ...form, salary: e.target.value })
                                }
                                placeholder="Salary"
                                className="w-full border p-3 rounded"
                            />
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                placeholder="Password"
                                className="w-full border p-3 rounded"
                            />
                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        type: e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            >
                                <option value="employee">
                                    Employee
                                </option>

                                <option value="hr">
                                    HR
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>

                            <div className="flex justify-end gap-2 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="cursor px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="cursor bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {editEmployee ? "Update" : "Save"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default EmployeeList;