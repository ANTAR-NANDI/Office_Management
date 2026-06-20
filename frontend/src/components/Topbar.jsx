import {
    Bell,
    Search,
    UserCircle2
} from "lucide-react";

function Topbar() {
    
    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
            {/* Left */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">
                    Dashboard
                </h2>
                <p className="text-sm text-slate-500">
                    Welcome back, Admin
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-5">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>

                {/* Notification */}
                <button className="relative">
                    <Bell
                        size={22}
                        className="text-slate-600"
                    />

                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
                        3
                    </span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2">
                    <UserCircle2
                        size={34}
                        className="text-cyan-600"
                    />

                    <div>
                        <h4 className="text-sm font-semibold">
                            Admin
                        </h4>

                        <p className="text-xs text-slate-500">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;