// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
function Profile() {
    const [profileForm, setProfileForm] = useState({
        name: localStorage.getItem("user_name") || "",
        email: "",
        phone: "",
        password: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const userRole = localStorage.getItem("user_role") || "employee";

    // 🟢 ১. পেজ লোড হলে ব্যাকএন্ড থেকে ইউজারের কারেন্ট প্রোফাইল ডেটা নিয়ে আসা
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            // ব্যাকএন্ডের প্রোফাইল এন্ডপয়েন্ট (যেখানে নিজের ডেটা দেখা যায়)
            const res = await api.get("/employees/profile/me"); 
            setProfileForm({
                name: res.data.name || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
                password: "" // পাসওয়ার্ড ফিল্ড খালি থাকবে
            });
        } catch (error) {
            console.error("Failed to load profile data:", error);
            // ব্যাকএন্ডে গেট এন্ডপয়েন্ট রেডি না থাকলে সাময়িকভাবে লোকালস্টোরেজ ডেটা ধরে রাখতে পারেন
            setProfileForm(prev => ({
                ...prev,
                name: localStorage.getItem("user_name") || ""
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileForm.name.trim()) return alert("Name field cannot be empty.");
        if (!profileForm.email.trim()) return alert("Email field cannot be empty.");
        if (!profileForm.phone.trim()) return alert("Phone field cannot be empty.");

        
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // ব্যাকএন্ডের প্রোফাইল আপডেট এন্ডপয়েন্টে ডেটা পাঠানো হচ্ছে
            const res = await api.put("/employees/profile/update", profileForm);
            
            // লোকাল স্টোরেজ আপডেট করা হচ্ছে যেন টপবারে নাম সাথে সাথে চেঞ্জ হয়
            localStorage.setItem("user_name", profileForm.name);
            
            setMessage({ type: "success", text: "Profile details updated successfully!" });
            setProfileForm(prev => ({ ...prev, password: "" })); // পাসওয়ার্ড ফিল্ড খালি করা
        } catch (error) {
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Failed to update profile details." 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-500 text-sm">Loading your profile information...</div>;
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">My Profile Settings</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your display name, contact information, and update your account login password securely.
                </p>
            </div>

            {/* STATUS NOTIFICATION BADGES */}
            {message.text && (
                <div className={`p-4 rounded-xl mb-6 font-medium text-sm border ${
                    message.type === "success" 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    {message.type === "success" ? "✅ " : "❌ "}{message.text}
                </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Responsive Grid System Layout (col-md-6 equivalent pairs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Display Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-medium"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* 🟢 ২. Email Input Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-medium"
                            placeholder="name@company.com"
                        />
                    </div>

                    {/* 🟢 ৩. Phone Number Input Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-medium"
                            placeholder="e.g. +88017XXXXXXXX"
                        />
                    </div>

                    {/* New Password Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                            New Password <span className="text-xs text-slate-400 font-normal">(Leave blank to keep same)</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={profileForm.password}
                            onChange={handleInputChange}
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Role Display Label (Read Only Context) */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700">Account System Role</label>
                        <input
                            type="text"
                            value={userRole}
                            disabled
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-500 capitalize cursor-not-allowed text-sm font-medium"
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white font-semibold py-2.5 px-8 rounded-xl shadow-md transition disabled:bg-slate-700 cursor-pointer text-center text-sm"
                    >
                        {saving ? "Saving Changes..." : "Save Profile Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;