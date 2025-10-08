import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout"; // Import the new layout
import Dashboard from "./pages/Dashboard";
import LeadershipModules from "./pages/LeadershipModules";
import Messages from "./pages/Messages";
import Feedback from "./pages/Feedback";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}> {/* Use MainLayout as the parent route */}
            <Route index element={<Dashboard />} /> {/* Default route for MainLayout */}
            <Route path="leadership-modules" element={<LeadershipModules />} />
            <Route path="messages" element={<Messages />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="users" element={<Users />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;