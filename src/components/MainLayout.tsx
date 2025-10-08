import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-2xl font-bold">AI Leadership Platform</h1>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Tabs value={currentPath}>
              <TabsList>
                <TabsTrigger value="/">
                  <Link to="/">Dashboard</Link>
                </TabsTrigger>
                <TabsTrigger value="/leadership-modules">
                  <Link to="/leadership-modules">Leadership Modules</Link>
                </TabsTrigger>
                <TabsTrigger value="/messages">
                  <Link to="/messages">My Feedback</Link>
                </TabsTrigger>
                <TabsTrigger value="/team-messages">
                  <Link to="/team-messages">Team Messages</Link>
                </TabsTrigger>
                <TabsTrigger value="/feedback">
                  <Link to="/feedback">Feedback History</Link>
                </TabsTrigger>
                <TabsTrigger value="/users">
                  <Link to="/users">Users</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt={user.email} />
                      <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.first_name || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;