import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  aiFeedback?: {
    tone: number;
    empathy: number;
    clarity: number;
    confidence: number;
  };
}

// Mock AI analysis function - now includes confidence
const analyzeMessage = (message: string) => {
  // Simulate AI processing and generate random scores
  const tone = Math.floor(Math.random() * 100);
  const empathy = Math.floor(Math.random() * 100);
  const clarity = Math.floor(Math.random() * 100);
  const confidence = Math.floor(Math.random() * 100); // New score
  return { tone, empathy, clarity, confidence };
};

const Messages = () => {
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing messages from Supabase on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('message_feedback')
          .select('id, message_text, tone, empathy, clarity, confidence, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages:', error);
          toast.error('Failed to load message history.');
        } else if (data) {
          const fetchedMessages: Message[] = data.map(item => ({
            id: item.id,
            text: item.message_text,
            timestamp: new Date(item.created_at).toLocaleString(),
            aiFeedback: {
              tone: item.tone,
              empathy: item.empathy,
              clarity: item.clarity,
              confidence: item.confidence,
            },
          }));
          setMessages(fetchedMessages);
        }
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("You must be logged in to send messages.");
      return;
    }
    if (currentMessage.trim()) {
      const feedback = analyzeMessage(currentMessage);

      // 1. Save message and feedback to message_feedback table
      const { data: newMessageData, error: insertError } = await supabase
        .from('message_feedback')
        .insert({
          user_id: user.id,
          message_text: currentMessage,
          tone: feedback.tone,
          empathy: feedback.empathy,
          clarity: feedback.clarity,
          confidence: feedback.confidence,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error saving message feedback:', insertError);
        toast.error('Failed to send message and get feedback.');
        return;
      }

      const newMessage: Message = {
        id: newMessageData.id,
        text: currentMessage,
        timestamp: new Date(newMessageData.created_at).toLocaleString(),
        aiFeedback: feedback,
      };
      setMessages((prev) => [newMessage, ...prev]);
      setCurrentMessage("");
      toast.success("Message sent and analyzed!");

      // 2. Recalculate average scores and update profiles table
      await updateProfileScores(user.id);

    } else {
      toast.error("Message cannot be empty.");
    }
  };

  const updateProfileScores = async (userId: string) => {
    const { data: allFeedback, error: fetchFeedbackError } = await supabase
      .from('message_feedback')
      .select('tone, empathy, clarity, confidence')
      .eq('user_id', userId);

    if (fetchFeedbackError) {
      console.error('Error fetching all feedback for score update:', fetchFeedbackError);
      return;
    }

    if (allFeedback && allFeedback.length > 0) {
      const totalTone = allFeedback.reduce((sum, fb) => sum + fb.tone, 0);
      const totalEmpathy = allFeedback.reduce((sum, fb) => sum + fb.empathy, 0);
      const totalClarity = allFeedback.reduce((sum, fb) => sum + fb.clarity, 0);
      const totalConfidence = allFeedback.reduce((sum, fb) => sum + fb.confidence, 0);
      const count = allFeedback.length;

      const avgTone = Math.round(totalTone / count);
      const avgEmpathy = Math.round(totalEmpathy / count);
      const avgClarity = Math.round(totalClarity / count);
      const avgConfidence = Math.round(totalConfidence / count);

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          tone_score: avgTone,
          empathy_score: avgEmpathy,
          clarity_score: avgClarity,
          confidence_score: avgConfidence,
        })
        .eq('id', userId);

      if (updateProfileError) {
        console.error('Error updating profile scores:', updateProfileError);
        toast.error('Failed to update overall communication scores.');
      }
    } else {
      // If no feedback, reset scores to 0
      const { error: resetProfileError } = await supabase
        .from('profiles')
        .update({
          tone_score: 0,
          empathy_score: 0,
          clarity_score: 0,
          confidence_score: 0,
        })
        .eq('id', userId);

      if (resetProfileError) {
        console.error('Error resetting profile scores:', resetProfileError);
      }
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
            <Button onClick={handleSendMessage} className="w-full" disabled={loading}>
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
              {loading ? (
                <p className="text-muted-foreground text-center">Loading messages...</p>
              ) : messages.length === 0 ? (
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
                            <div className="flex items-center justify-between text-sm">
                              <span>Confidence:</span>
                              <Progress value={message.aiFeedback.confidence} className="w-3/4 h-2" />
                              <span>{message.aiFeedback.confidence}%</span>
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