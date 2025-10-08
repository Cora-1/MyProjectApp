import React, { useState, useEffect, useCallback, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Send, Trash2 } from "lucide-react";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email: string;
}

interface TeamMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  created_at: string;
  sender_profile?: UserProfile;
  receiver_profile?: UserProfile;
}

const TeamMessages = () => {
  const { user } = useAuth();
  const [teammates, setTeammates] = useState<UserProfile[]>([]);
  const [selectedTeammate, setSelectedTeammate] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAvatarFallback = (profile: UserProfile) => {
    return (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') || profile.email?.[0]?.toUpperCase();
  };

  const fetchTeammates = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: allAcceptedInvites, error: acceptedInvitesError } = await supabase
        .from('team_invitations')
        .select(`
          id,
          sender_id,
          receiver_email,
          status,
          created_at
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_email.eq.${user.email}`);

      if (acceptedInvitesError) throw acceptedInvitesError;

      const teammateIds = new Set<string>();
      const fetchedTeammates: UserProfile[] = [];

      for (const invite of allAcceptedInvites) {
        let teammateProfile: UserProfile | null = null;
        if (invite.sender_id === user.id) {
          // Current user is sender, receiver_email is the teammate
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, email')
            .eq('email', invite.receiver_email)
            .single();
          if (profileError && profileError.code !== 'PGRST116') throw profileError;
          teammateProfile = profileData;
        } else if (invite.receiver_email === user.email) {
          // Current user is receiver, sender_id is the teammate
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, email')
            .eq('id', invite.sender_id)
            .single();
          if (profileError && profileError.code !== 'PGRST116') throw profileError;
          teammateProfile = profileData;
        }

        if (teammateProfile && !teammateIds.has(teammateProfile.id)) {
          fetchedTeammates.push(teammateProfile);
          teammateIds.add(teammateProfile.id);
        }
      }
      setTeammates(fetchedTeammates);
    } catch (error: any) {
      console.error('Error fetching teammates:', error);
      toast.error(`Failed to load teammates: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (teammateId: string) => {
    if (!user || !teammateId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          message_text,
          created_at,
          sender_profile:sender_id(id, first_name, last_name, avatar_url, email),
          receiver_profile:receiver_id(id, first_name, last_name, avatar_url, email)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${teammateId}),and(sender_id.eq.${teammateId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as TeamMessage[]);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error(`Failed to load messages: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTeammates();
  }, [fetchTeammates]);

  useEffect(() => {
    if (selectedTeammate) {
      fetchMessages(selectedTeammate.id);
    } else {
      setMessages([]);
    }
  }, [selectedTeammate, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !selectedTeammate || !currentMessage.trim()) {
      toast.error("Please select a teammate and type a message.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedTeammate.id,
          message_text: currentMessage.trim(),
        })
        .select(`
          id,
          sender_id,
          receiver_id,
          message_text,
          created_at,
          sender_profile:sender_id(id, first_name, last_name, avatar_url, email),
          receiver_profile:receiver_id(id, first_name, last_name, avatar_url, email)
        `)
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data as TeamMessage]);
      setCurrentMessage("");
      toast.success("Message sent!");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete messages.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`); // Ensure only sender/receiver can delete

      if (error) throw error;

      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      toast.success("Message deleted.");
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(`Failed to delete message: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Team Messages</h2>
      <p className="text-muted-foreground">Communicate directly with your teammates.</p>

      {/* Changed grid to default to 1 column and expand to 3 on large screens */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Teammates List */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Your Teammates</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] lg:h-[500px] pr-4"> {/* Adjusted height for mobile */}
              {loading ? (
                <p className="text-muted-foreground text-center">Loading teammates...</p>
              ) : teammates.length === 0 ? (
                <p className="text-muted-foreground text-center">No teammates yet. Invite someone on the Users page!</p>
              ) : (
                <div className="space-y-2">
                  {teammates.map((teammate) => (
                    <Button
                      key={teammate.id}
                      variant={selectedTeammate?.id === teammate.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-2"
                      onClick={() => setSelectedTeammate(teammate)}
                    >
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src={teammate.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${teammate.email}`} alt={`${teammate.first_name} ${teammate.last_name}`} />
                        <AvatarFallback>{getAvatarFallback(teammate)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{teammate.first_name} {teammate.last_name}</p>
                        <p className="text-xs text-muted-foreground">{teammate.email}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="bg-card text-card-foreground border-border lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>
              {selectedTeammate ? `Chat with ${selectedTeammate.first_name} ${selectedTeammate.last_name}` : "Select a Teammate to Chat"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <ScrollArea className="h-[300px] lg:h-[400px] pr-4 mb-4"> {/* Adjusted height for mobile */}
              {selectedTeammate ? (
                loading ? (
                  <p className="text-muted-foreground text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender_id !== user?.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender_profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${message.sender_profile?.email}`} alt={message.sender_profile?.email} />
                            <AvatarFallback>{getAvatarFallback(message.sender_profile || { id: '', first_name: '', last_name: '', email: '' })}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`relative p-3 rounded-lg max-w-[70%] ${message.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          <p className="text-sm">{message.message_text}</p>
                          <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {/* Delete button only visible on hover for desktop, but always present for touch on mobile */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100 md:group-hover:opacity-100"
                            onClick={() => handleDeleteMessage(message.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        {message.sender_id === user?.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender_profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${message.sender_profile?.email}`} alt={message.sender_profile?.email} />
                            <AvatarFallback>{getAvatarFallback(message.sender_profile || { id: '', first_name: '', last_name: '', email: '' })}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )
              ) : (
                <p className="text-muted-foreground text-center">Select a teammate from the left to start chatting.</p>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Textarea
                placeholder="Type your message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 min-h-[40px] bg-input text-foreground border-border"
                disabled={!selectedTeammate || loading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!selectedTeammate || loading}>
                <Send className="h-4 w-4 mr-2" /> Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamMessages;