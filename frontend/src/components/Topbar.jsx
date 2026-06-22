import {
    Bell,
    Search,
    UserCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
function Topbar() {
    const navigate = useNavigate();
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

                    <button
                        onClick={() => {
                            navigate("/profile"); // 👈 পরিবর্তন করে সেটিংসের বদলে "/profile" এ পাঠানো হচ্ছে
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition text-left cursor-pointer font-medium"
>
    <UserCircle2 size={16} /> {/* আপনি চাইলে এখানে আইকন পরিবর্তন করতে পারেন */}
    My Profile
</button>
                </div>
            </div>
        </header>
    );
}

export default Topbar;