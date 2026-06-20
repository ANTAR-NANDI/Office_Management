import { useState } from "react";

function EmployeeCreate() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "",
        salary: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        // API call here later
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Add Employee
                </h2>
                <p className="text-slate-500">
                    Create a new employee record
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Employee Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Designation
                        </label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Salary
                        </label>
                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl"
                    >
                        Save Employee
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeCreate;