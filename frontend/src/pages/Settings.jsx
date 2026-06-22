// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

function Settings() {
    const [form, setForm] = useState({
        office_name: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Enforce frontend view restrictions
    const userRole = localStorage.getItem("user_role");
    const isAdmin = userRole === "admin";

    useEffect(() => {
        fetchCurrentSettings();
    }, []);

    const fetchCurrentSettings = async () => {
        try {
            const res = await api.get("/settings");
            setForm({
                office_name: res.data.office_name || "",
                address: res.data.address || "",
                latitude: res.data.latitude || "",
                longitude: res.data.longitude || "",
                radius: res.data.radius || "100"
            });
        } catch (error) {
            console.error("Failed to load settings data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await api.post("/settings/update", form);
            setMessage({ type: "success", text: res.data.message });
        } catch (error) {
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Failed to save configuration coordinates." 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-500">Loading dynamic configurations...</div>;
    }

    return (
       <div className="w-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Office Settings & Geofencing</h2>
        <p className="text-sm text-slate-500 mt-1">
            Configure your physical work location boundaries to restrict attendance check-ins.
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

    <form onSubmit={handleSubmit} className="space-y-5">
        {/* 🟢 Grid Wrapper: Equivalent to a Bootstrap row layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Office Name (col-md-6) */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Office Name</label>
                <input
                    type="text"
                    name="office_name"
                    value={form.office_name}
                    onChange={handleInputChange}
                    disabled={!isAdmin}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="e.g. Dhaka Headquarters HQ"
                />
            </div>

            {/* Allowed Radius (col-md-6) */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Allowed Radius Boundary</label>
                <div className="relative">
                    <input
                        type="number"
                        name="radius"
                        value={form.radius}
                        onChange={handleInputChange}
                        disabled={!isAdmin}
                        className="w-full border border-slate-200 p-3 pr-16 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed font-medium"
                        placeholder="100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                        meters
                    </div>
                </div>
            </div>

            {/* Latitude Coordinates (col-md-6) */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Latitude Coordinates</label>
                <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleInputChange}
                    disabled={!isAdmin}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="e.g. 23.8103"
                />
            </div>

            {/* Longitude Coordinates (col-md-6) */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Longitude Coordinates</label>
                <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleInputChange}
                    disabled={!isAdmin}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="e.g. 90.4125"
                />
            </div>

            {/* Office Address (Spans across full width if needed, or row placement) */}
            <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Office Address</label>
                <textarea
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    disabled={!isAdmin}
                    rows="2"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="Full Street address location text description"
                />
            </div>

        </div>

        {/* FORM SUBMISSION CONTROLS */}
        <div className="pt-4">
            {isAdmin ? (
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 active:scale-[0.99] text-white font-semibold py-3 px-8 rounded-xl shadow-md transition disabled:bg-cyan-400 cursor-pointer text-center"
                >
                    {saving ? "Saving Changes..." : "Update System Parameters"}
                </button>
            ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl font-medium">
                    🔒 Read-Only Access: Only users with Admin level configurations can rewrite geofencing location settings.
                </div>
            )}
        </div>
    </form>
</div>
    );
}

export default Settings;