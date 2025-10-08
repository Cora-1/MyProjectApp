import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import LeadershipModules from "./pages/LeadershipModules";
import ModuleLesson from "./pages/ModuleLesson";
import Messages from "./pages/Messages";
import TeamMessages from "./pages/TeamMessages"; // Import the new TeamMessages page
import Feedback from "./pages/Feedback";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="leadership-modules" element={<LeadershipModules />} />
              <Route path="leadership-modules/:moduleId" element={<ModuleLesson />} />
              <Route path="messages" element={<Messages />} />
              <Route path="team-messages" element={<TeamMessages />} /> {/* New route for Team Messages */}
              <Route path="feedback" element={<Feedback />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;