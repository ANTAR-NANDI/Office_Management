import { useEffect, useState } from "react";
import api from "../../api/axios";

function UserList() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        type: "Employee",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditUser(null);

        setForm({
            name: "",
            email: "",
            password: "",
            type: "Employee",
        });

        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditUser(user);

        setForm({
            name: user.name,
            email: user.email,
            password: "",
            type: user.type,
        });

        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editUser) {
                await api.put(
                    `/users/update/${editUser.id}`,
                    form
                );
            } else {
                await api.post(
                    "/users/create",
                    form
                );
            }

            setIsModalOpen(false);
            fetchUsers();

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this user?")) {
            return;
        }

        try {
            await api.delete(`/users/delete/${id}`);
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">
                    Users
                </h2>

                <button
                    onClick={openCreateModal}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                    Add User
                </button>
            </div>

            <table className="w-full">

                <thead>
                    <tr className="bg-slate-100">
                        <th className="p-3">#</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user, index) => (

                        <tr
                            key={user.id}
                            className="border-b"
                        >
                            <td className="p-3">
                                {index + 1}
                            </td>

                            <td className="p-3">
                                {user.name}
                            </td>

                            <td className="p-3">
                                {user.email}
                            </td>

                            <td className="p-3">
                                <span className="px-3 py-1 rounded bg-cyan-100 text-cyan-700">
                                    {user.type}
                                </span>
                            </td>

                            <td className="p-3">

                                <button
                                    onClick={() => openEditModal(user)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                    <div className="bg-white w-full max-w-lg p-6 rounded-xl">

                        <h2 className="text-xl font-bold mb-4">
                            {editUser ? "Edit User" : "Add User"}
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            <input
                                type="text"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="password"
                                placeholder={
                                    editUser
                                        ? "Leave blank to keep password"
                                        : "Password"
                                }
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
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
                                <option value="Admin">
                                    Admin
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Employee">
                                    Employee
                                </option>
                            </select>

                            <div className="flex justify-end gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    className="border px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {editUser
                                        ? "Update"
                                        : "Save"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default UserList;