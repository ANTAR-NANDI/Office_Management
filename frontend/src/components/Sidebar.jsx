import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen">
            <div className="p-5 border-b border-slate-700">
                <h1 className="text-xl font-bold">
                    Office Management
                </h1>
            </div>

            <ul className="p-3 space-y-2">
                <li>
                    <Link
                        to="/dashboard"
                        className="block px-4 py-2 rounded hover:bg-slate-700"
                    >
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        to="/employees"
                        className="block px-4 py-2 rounded hover:bg-slate-700"
                    >
                        Employees
                    </Link>
                </li>

                <li>
                    <Link
                        to="/settings"
                        className="block px-4 py-2 rounded hover:bg-slate-700"
                    >
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;