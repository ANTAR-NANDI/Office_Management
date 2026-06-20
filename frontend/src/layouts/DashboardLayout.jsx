import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Topbar />

                <main className="flex-1 p-6 bg-gray-100">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default DashboardLayout;