import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  aiFeedback?: {
    tone: number;
    empathy: number;
    clarity: number;
  };
}

// Mock AI analysis function
const analyzeMessage = (message: string) => {
  // Simulate AI processing and generate random scores
  const tone = Math.floor(Math.random() * 100);
  const empathy = Math.floor(Math.random() * 100);
  const clarity = Math.floor(Math.random() * 100);
  return { tone, empathy, clarity };
};

const Messages = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newId = Date.now().toString();
      const feedback = analyzeMessage(currentMessage);
      const newMessage: Message = {
        id: newId,
        text: currentMessage,
        timestamp: new Date().toLocaleString(),
        aiFeedback: feedback,
      };
      setMessages((prev) => [newMessage, ...prev]);
      setCurrentMessage("");
      toast.success("Message sent and analyzed!");
    } else {
      toast.error("Message cannot be empty.");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Messages</h2>
      <p className="text-muted-foreground">Send messages and receive instant AI feedback on your communication style.</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Send a New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your message here..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="min-h-[100px] bg-input text-foreground border-border"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendMessage} className="w-full">
              Send Message & Get Feedback
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Message History & AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center">No messages sent yet. Start typing!</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className="bg-secondary text-secondary-foreground border-border">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">{message.timestamp}</p>
                        <p className="mb-4">{message.text}</p>
                        {message.aiFeedback && (
                          <div className="space-y-2">
                            <p className="font-semibold">AI Feedback:</p>
                            <div className="flex items-center justify-between text-sm">
                              <span>Tone:</span>
                              <Progress value={message.aiFeedback.tone} className="w-3/4 h-2" />
                              <span>{message.aiFeedback.tone}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Empathy:</span>
                              <Progress value={message.aiFeedback.empathy} className="w-3/4 h-2" />
                              <span>{message.aiFeedback.empathy}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Clarity:</span>
                              <Progress value={message.aiFeedback.clarity} className="w-3/4 h-2" />
                              <span>{message.aiFeedback.clarity}%</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;