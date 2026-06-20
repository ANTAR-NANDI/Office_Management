import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
import Reports from "../pages/reports/Reports";
import DashboardLayout from "../layouts/DashboardLayout";
import AttendanceDetails from "../pages/reports/AttendanceDetails";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/employees"
                        element={<EmployeeList />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                        <Route
                            path="/attendance-details/:id"
                            element={<AttendanceDetails />}
                        />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;