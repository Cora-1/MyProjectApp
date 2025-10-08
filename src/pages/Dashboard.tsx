import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
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