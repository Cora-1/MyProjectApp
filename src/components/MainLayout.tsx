import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MadeWithDyad } from "@/components/made-with-dyad";

const MainLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
                  <Link to="/messages">Messages</Link>
                </TabsTrigger>
                <TabsTrigger value="/feedback">
                  <Link to="/feedback">Feedback</Link>
                </TabsTrigger>
                <TabsTrigger value="/users">
                  <Link to="/users">Users</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default MainLayout;