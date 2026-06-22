import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";

import Attendance from "../pages/attendance/Attendance";
import AttendanceDetails from "../pages/attendance/AttendanceDetails";

import DashboardLayout from "../layouts/DashboardLayout";
import Settings from "../pages/Settings";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Layout */}
                <Route element={<DashboardLayout />}>

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/employees" element={<EmployeeList />} />

                    {/* Attendance Module */}
                    <Route path="/report/attendance" element={<Attendance />} />

                    <Route
                        path="/report/attendance/details/:id"
                        element={<AttendanceDetails />}
                    />
                    <Route path="/settings" element={<Settings />} />


                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;