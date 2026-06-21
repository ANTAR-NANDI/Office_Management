import { NavLink, useNavigate, useLocation } from "react-router-dom"; // Merged & added useLocation
import { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { 
    ChevronDown, 
    LayoutDashboard, 
    Users, 
    Settings, 
    FileText, 
    LogOut 
} from "lucide-react";

import { logout } from "../utils/auth";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to find current active URL path
    const [openMenu, setOpenMenu] = useState(null);

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

    // Automatically expand parent dropdown if a sub-route is active on page load/refresh
    useEffect(() => {
        const currentActiveParent = menuItems.find(item => 
            item.children?.some(child => child.path === location.pathname)
        );
        if (currentActiveParent) {
            setOpenMenu(currentActiveParent.name);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

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


            {/* Menu Section */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                <>
                                    {/* Parent Menu Item (Dropdown Button) */}
                                    <button
                                        onClick={() =>
                                            setOpenMenu(openMenu === item.name ? null : item.name)
                                        }
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
                                            menuItems.find(i => i.name === item.name)?.children?.some(c => c.path === location.pathname)
                                                ? "text-white bg-slate-800/50"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${
                                                openMenu === item.name ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Dropdown Menu Children */}
                                    {openMenu === item.name && (
                                        <ul className="ml-9 mt-1 pl-2 border-l border-slate-800 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <NavLink
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `block px-3 py-2 rounded-lg text-sm transition-all ${
                                                                isActive
                                                                    ? "text-cyan-400 font-medium bg-slate-800"
                                                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                                            }`
                                                        }
                                                    >
                                                        {child.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                /* Standard Base Link (No Dropdown Child) */
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                            isActive
                                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
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
            </nav>

            {/* Profile/User Section */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-all py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-red-500/10"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;