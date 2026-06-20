import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/logo.png";
import { ChevronDown } from "lucide-react";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    LogOut
} from "lucide-react";

import { logout } from "../utils/auth";

function Sidebar() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

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
            children: [
                {
                    name: "Attendance Report",
                    path: "/report/attendance",
                },
                {
                    name: "Salary Report",
                    path: "/report/salary",
                }
            ]
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
          <div className="h-24 flex items-center px-6 border-b border-slate-800">
    <img
        src={Logo}
        alt="Logo"
        className="h-53 mt-8 w-full object-contain"
    />
</div>

            {/* Menu */}
            <div className="flex-1 p-4">
                <ul className="space-y-2">

                    {menuItems.map((item) => (
                        <li key={item.name}>

                            {/* PARENT MENU */}
                            {item.children ? (
                                <>
                                   <button
    onClick={() =>
        setOpenMenu(
            openMenu === item.name ? null : item.name
        )
    }
    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
>
    <div className="flex items-center gap-3">
        {item.icon}
        {item.name}
    </div>

    <ChevronDown
        size={16}
        className={`transition-transform ${
            openMenu === item.name ? "rotate-180" : ""
        }`}
    />
</button>

                                    {/* DROPDOWN */}
                                    {openMenu === item.name && (
                                        <ul className="ml-6 mt-2 space-y-2">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <NavLink
                                                        to={child.path}
                                                        className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800"
                                                    >
                                                        {child.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                            isActive
                                                ? "bg-cyan-500 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            )}

                        </li>
                    ))}

                </ul>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm font-medium"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;