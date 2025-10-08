import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const LeadershipModules = () => {
  const modules = [
    {
      id: "effective-listening",
      title: "Module 1: Effective Listening",
      content: "Learn the art of active listening to improve understanding and build stronger relationships. Key tips include paraphrasing, asking clarifying questions, and avoiding interruptions.",
    },
    {
      id: "constructive-feedback",
      title: "Module 2: Giving Constructive Feedback",
      content: "Master the skill of providing feedback that is both honest and helpful. Focus on specific behaviors, impact, and future-oriented solutions.",
    },
    {
      id: "conflict-resolution",
      title: "Module 3: Conflict Resolution",
      content: "Strategies for navigating disagreements and finding mutually beneficial outcomes. Emphasize empathy, clear communication, and seeking common ground.",
    },
    {
      id: "motivational-leadership",
      title: "Module 4: Motivational Leadership",
      content: "Inspire and empower your team through positive reinforcement, clear vision, and leading by example. Understand different motivational drivers.",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Leadership Modules</h2>
      <p className="text-muted-foreground">Enhance your leadership skills with curated lessons and tips.</p>

      <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-card text-card-foreground">
        <div className="grid gap-6">
          {modules.map((module) => (
            <Link to={`/leadership-modules/${module.id}`} key={module.id}>
              <Card className="bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{module.content}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadershipModules;