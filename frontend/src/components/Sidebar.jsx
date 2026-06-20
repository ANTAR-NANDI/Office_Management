import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import {
    LayoutDashboard,
    Users,
    Settings,
    Building2,
    FileText,
    LogOut
} from "lucide-react";
import { logout } from "../utils/auth";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const menuItems = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard size={18} />,
            path: "/dashboard",
        },
        {
            name: "Employees",
            icon: <Users size={18} />,
            path: "/employees",
        },
       {
    name: "Reports",
    icon: <FileText size={18} />,
    path: "/reports",
},
        {
            name: "Settings",
            icon: <Settings size={18} />,
            path: "/settings",
        },
    ];

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-3xl">
            {/* Logo */}
           <div className="h-30 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    {/* লোগো ইমেজ */}
                    <img 
                        src={Logo} 
                        alt="Office Management Logo" 
                        className="h-50 bg-slate-900 w-100 object-contain rounded-lg"
                    />
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? "bg-cyan-500 text-white shadow-lg"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                        A
                    </div>

                    <div>
                        <h4 className="text-sm font-medium">
                            Admin
                        </h4>
                        <p className="text-xs text-slate-400">
                            Administrator
                        </p>
                    </div>
                </div>

                <button onClick={handleLogout} className="w-full mt-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm font-medium transition">
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;