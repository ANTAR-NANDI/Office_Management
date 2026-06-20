import { useState } from "react";
import api from "../../api/axios";
import { UserPlus, User, Mail, Phone, Briefcase, DollarSign, Save, Loader2 } from "lucide-react";

function EmployeeCreate() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "",
        salary: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/employees/create", form);
            alert("Employee Created");

            setForm({
                name: "",
                email: "",
                phone: "",
                designation: "",
                salary: "",
            });
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            {/* Header section of the form */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <UserPlus size={24} className="text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Add New Employee</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Create a new profile inside the management system</p>
                </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Name Input */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Full Name
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User size={18} />
                            </div>
                            <input 
                                required
                                name="name" 
                                value={form.name} 
                                onChange={handleChange} 
                                placeholder="John Doe" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input 
                                required
                                type="email"
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                placeholder="john@company.com" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Phone Number
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Phone size={18} />
                            </div>
                            <input 
                                required
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange} 
                                placeholder="+880 1xxx xxxxxx" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                    {/* Designation Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Designation
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Briefcase size={18} />
                            </div>
                            <input 
                                required
                                name="designation" 
                                value={form.designation} 
                                onChange={handleChange} 
                                placeholder="Software Engineer" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                    {/* Salary Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Monthly Salary
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <DollarSign size={18} />
                            </div>
                            <input 
                                required
                                type="number"
                                name="salary" 
                                value={form.salary} 
                                onChange={handleChange} 
                                placeholder="50000" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
                            />
                        </div>
                    </div>

                </div>

                {/* Submit Action Area */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Employee
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeCreate;