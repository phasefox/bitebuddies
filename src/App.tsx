import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import { Analytics } from "@/pages/Analytics";
import { Reviews } from "@/pages/Reviews";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/dashboard/analytics" element={
          <ProtectedRoute>
            <DashboardLayout><Analytics /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reviews" element={
          <ProtectedRoute>
            <DashboardLayout><Reviews /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
