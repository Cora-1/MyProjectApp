import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

const mockUsers: User[] = [
  { id: "u1", name: "Alice Johnson", role: "Team Lead", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Alice" },
  { id: "u2", name: "Bob Smith", role: "Software Engineer", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Bob" },
  { id: "u3", name: "Charlie Brown", role: "Product Manager", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Charlie" },
  { id: "u4", name: "Diana Prince", role: "UX Designer", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Diana" },
  { id: "u5", name: "Eve Adams", role: "Marketing Specialist", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Eve" },
  { id: "u6", name: "Frank White", role: "Data Analyst", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Frank" },
];

const Users = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Workspace Users</h2>
      <p className="text-muted-foreground">Manage and view members of your leadership platform workspace.</p>

      <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-card text-card-foreground">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockUsers.map((user) => (
            <Card key={user.id} className="bg-secondary text-secondary-foreground border-border">
              <CardContent className="flex items-center p-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Users;