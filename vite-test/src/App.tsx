import { Routes, Route } from "react-router-dom";
import TicketFormPage from "./pages/TicketFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AdminLoginPage from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import TicketsManagement from "./pages/TicketsManagement";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<TicketFormPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/tickets" element={<ProtectedRoute><TicketsManagement /></ProtectedRoute>} />
        </Routes>
    );
}