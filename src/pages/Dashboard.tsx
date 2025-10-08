import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile for dashboard:', error);
        } else if (data) {
          setProfile(data);
        }
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const stats = [
    { name: "Tone", score: 75, description: "Your overall communication tone." },
    { name: "Empathy", score: 82, description: "How well you connect with others' feelings." },
    { name: "Clarity", score: 68, description: "The conciseness and understanding of your messages." },
    { name: "Confidence", score: 90, description: "Your perceived self-assurance in communication." },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="text-muted-foreground">Your personal communication and leadership insights at a glance.</p>

      {user && (
        <Card className="bg-card text-card-foreground border-border p-6 flex items-center space-x-4">
          {loadingProfile ? (
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse"></div>
          ) : (
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || user.email}`} alt={`${profile?.first_name} ${profile?.last_name}`} />
              <AvatarFallback>{(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '') || user.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h3 className="text-xl font-semibold">
              Welcome, {loadingProfile ? 'Loading...' : (profile?.first_name || user.email)}!
            </h3>
            <p className="text-muted-foreground">Here's a summary of your leadership metrics.</p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-xl">{stat.name} Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-semibold">{stat.score}%</span>
                <span className="text-sm text-muted-foreground">{stat.description}</span>
              </div>
              <Progress value={stat.score} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;