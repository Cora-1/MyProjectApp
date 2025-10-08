import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MessageFeedback {
  id: string;
  message_text: string;
  tone: number;
  empathy: number;
  clarity: number;
  confidence: number;
  created_at: string;
}

const Feedback = () => {
  const { user } = useAuth();
  const [feedbackHistory, setFeedbackHistory] = useState<MessageFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('message_feedback')
          .select('id, message_text, tone, empathy, clarity, confidence, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching feedback history:', error);
          toast.error('Failed to load feedback history.');
        } else if (data) {
          setFeedbackHistory(data);
        }
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [user]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Feedback History</h2>
      <p className="text-muted-foreground">All your AI communication reviews and insights are stored here.</p>

      <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-card text-card-foreground">
        {loading ? (
          <p className="text-muted-foreground text-center">Loading feedback history...</p>
        ) : feedbackHistory.length === 0 ? (
          <p className="text-muted-foreground text-center">No feedback recorded yet. Send some messages on the Messages page!</p>
        ) : (
          <div className="grid gap-6">
            {feedbackHistory.map((feedback) => (
              <Card key={feedback.id} className="bg-secondary text-secondary-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span>AI Review - {new Date(feedback.created_at).toLocaleDateString()}</span>
                    <span className="text-sm text-muted-foreground">ID: {feedback.id.substring(0, 8)}...</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 italic text-muted-foreground">"{feedback.message_text}"</p>
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">Scores:</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tone:</span>
                      <Progress value={feedback.tone} className="w-3/4 h-2" />
                      <span>{feedback.tone}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Empathy:</span>
                      <Progress value={feedback.empathy} className="w-3/4 h-2" />
                      <span>{feedback.empathy}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Clarity:</span>
                      <Progress value={feedback.clarity} className="w-3/4 h-2" />
                      <span>{feedback.clarity}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Confidence:</span>
                      <Progress value={feedback.confidence} className="w-3/4 h-2" />
                      <span>{feedback.confidence}%</span>
                    </div>
                  </div>
                  {/* AI Notes are not stored in DB, so removing this section */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Feedback;