import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import LeadershipModules from "./pages/LeadershipModules";
import Messages from "./pages/Messages";
import Feedback from "./pages/Feedback";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Import the Login page
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Profile from "./pages/Profile"; // Import Profile page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route element={<ProtectedRoute />}> {/* Protected routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="leadership-modules" element={<LeadershipModules />} />
              <Route path="messages" element={<Messages />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} /> {/* Profile route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;