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
                    Welcome back, Admin
                </h2>
                
            </div>

            {/* Right */}
            <div className="flex items-center gap-5">
                

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