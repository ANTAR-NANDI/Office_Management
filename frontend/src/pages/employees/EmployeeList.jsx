import { Link } from "react-router-dom";

function EmployeeList() {

    const employees = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "01711111111",
            designation: "Manager",
            salary: 30000,
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "01822222222",
            designation: "Accountant",
            salary: 25000,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Employee List
                    </h2>

                    <p className="text-slate-500">
                        Manage all employees
                    </p>
                </div>

                <Link
                    to="/employees/create"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-xl"
                >
                    Add Employee
                </Link>
            </div>

            <div className="overflow-x-auto">
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
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                                        Edit
                                    </button>

                                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default EmployeeList;