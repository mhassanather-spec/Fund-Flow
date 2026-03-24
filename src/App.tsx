import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About from "./pages/About";
import WhyTracking from "./pages/WhyTracking";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/why-important" element={<WhyTracking />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {!user ? (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <Route element={<ExpenseProvider><Layout /></ExpenseProvider>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
