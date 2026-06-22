import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/logo.png"; // [cite: 127]
import { 
    ChevronDown, 
    LayoutDashboard, 
    Users, 
    Settings, 
    FileText, 
    LogOut 
} from "lucide-react"; // [cite: 127, 128]
import { logout } from "../utils/auth";

function Sidebar() {
    const navigate = useNavigate(); // [cite: 129]
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(null); // [cite: 129]
    
    // 👈 Get the current user's role from local storage
    const userRole = localStorage.getItem("user_role") || "employee";

    const menuItems = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard size={18} />,
            path: "/dashboard",
            allowedRoles: ["admin", "hr", "employee"] // Accessible to everyone
        },
        {
            name: "Employees",
            icon: <Users size={18} />,
            path: "/employees",
            allowedRoles: ["admin", "hr"] // 👈 Hides completely from standard 'employee'
        },
        {
            name: "Reports",
            icon: <FileText size={18} />,
            allowedRoles: ["admin", "hr"], // 👈 Restricts entire dropdown grouping
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
            name: "Leave Requests",
            icon: <FileText size={18} />,
            path: "/leaves",
            allowedRoles: ["admin", "hr", "employee"] // View scope handles sorting rules internally
        },
        {
            name: "Settings",
            icon: <Settings size={18} />,
            path: "/settings",
            allowedRoles: ["admin"] // 👈 Strictly visible to 'admin'
        },
    ];

    // Filter items based on the user's role
    const filteredMenuItems = menuItems.filter(item => 
        item.allowedRoles.includes(userRole)
    );

    useEffect(() => {
        const currentActiveParent = filteredMenuItems.find(item => 
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
        <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-2xl sticky top-0">
            <div className="h-20 flex items-center justify-center px-6 border-b border-slate-800">
                <img src={Logo} alt="Logo" className="h-12 w-auto object-contain" />
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {/* Map over filtered items instead of the raw array */}
                    {filteredMenuItems.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => setOpenMenu(openMenu === item.name ? null : item.name)}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform ${openMenu === item.name ? "rotate-180" : ""}`} />
                                    </button>
                                    {openMenu === item.name && (
                                        <ul className="ml-9 mt-1 pl-2 border-l border-slate-800 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <NavLink
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `block px-3 py-2 rounded-lg text-sm ${isActive ? "text-cyan-400 font-medium bg-slate-800" : "text-slate-400 hover:text-white"}`
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
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive ? "bg-cyan-500 text-white" : "text-slate-300 hover:bg-slate-800"}`
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