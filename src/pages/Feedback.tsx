import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const mockFeedback = [
  {
    id: "fb1",
    date: "2023-10-26",
    messageSnippet: "Regarding the Q4 report, I think we should...",
    aiFeedback: { tone: 78, empathy: 65, clarity: 88 },
    notes: "Good clarity, but could use a slightly more empathetic tone when discussing team contributions.",
  },
  {
    id: "fb2",
    date: "2023-10-25",
    messageSnippet: "Team, let's aim to complete this by Friday.",
    aiFeedback: { tone: 92, empathy: 70, clarity: 95 },
    notes: "Excellent clarity and confident tone. Consider adding a brief 'how can I support you' for higher empathy.",
  },
  {
    id: "fb3",
    date: "2023-10-24",
    messageSnippet: "I'm concerned about the project timeline.",
    aiFeedback: { tone: 55, empathy: 40, clarity: 60 },
    notes: "Tone was perceived as slightly negative. Try rephrasing concerns with a solution-oriented approach. Empathy score is low, consider acknowledging team efforts.",
  },
  {
    id: "fb4",
    date: "2023-10-23",
    messageSnippet: "Great job everyone on the recent launch!",
    aiFeedback: { tone: 98, empathy: 95, clarity: 90 },
    notes: "Outstanding positive feedback! High scores across the board. Keep up the great work.",
  },
];

const Feedback = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Feedback History</h2>
      <p className="text-muted-foreground">All your AI communication reviews and insights are stored here.</p>

      <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-card text-card-foreground">
        <div className="grid gap-6">
          {mockFeedback.map((feedback) => (
            <Card key={feedback.id} className="bg-secondary text-secondary-foreground border-border">
              <CardHeader>
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>AI Review - {feedback.date}</span>
                  <span className="text-sm text-muted-foreground">ID: {feedback.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-muted-foreground">"{feedback.messageSnippet}"</p>
                {feedback.aiFeedback && (
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">Scores:</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tone:</span>
                      <Progress value={feedback.aiFeedback.tone} className="w-3/4 h-2" />
                      <span>{feedback.aiFeedback.tone}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Empathy:</span>
                      <Progress value={feedback.aiFeedback.empathy} className="w-3/4 h-2" />
                      <span>{feedback.aiFeedback.empathy}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Clarity:</span>
                      <Progress value={feedback.aiFeedback.clarity} className="w-3/4 h-2" />
                      <span>{feedback.aiFeedback.clarity}%</span>
                    </div>
                  </div>
                )}
                <p className="text-sm">
                  <span className="font-semibold">AI Notes:</span> {feedback.notes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Feedback;