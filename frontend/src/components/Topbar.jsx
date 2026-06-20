import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Topbar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="bg-white shadow px-6 py-4 flex justify-between">
            <h2>Dashboard</h2>

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </header>
    );
}

export default Topbar;