import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Check, X } from "lucide-react";
import InviteTeammateDialog from "@/components/InviteTeammateDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email: string;
}

interface TeamInvitation {
  id: string;
  sender_id: string;
  receiver_email: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender_profile?: UserProfile; // To display sender's name/avatar
}

const Users = () => {
  const { user } = useAuth();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [teammates, setTeammates] = useState<UserProfile[]>([]);
  const [sentInvitations, setSentInvitations] = useState<TeamInvitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeammatesAndInvitations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch accepted invitations where current user is sender or receiver
      const { data: acceptedInvites, error: acceptedInvitesError } = await supabase
        .from('team_invitations')
        .select(`
          id,
          sender_id,
          receiver_email,
          status,
          created_at,
          sender_profile:sender_id(id, first_name, last_name, avatar_url, email)
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_email.eq.${user.email}`);

      if (acceptedInvitesError) throw acceptedInvitesError;

      const teammateIds = new Set<string>();
      const fetchedTeammates: UserProfile[] = [];

      for (const invite of acceptedInvites) {
        if (invite.sender_id === user.id) {
          // Current user is sender, receiver is teammate
          const { data: receiverProfile, error: receiverProfileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, email')
            .eq('email', invite.receiver_email)
            .single();
          if (receiverProfileError && receiverProfileError.code !== 'PGRST116') throw receiverProfileError;
          if (receiverProfile && !teammateIds.has(receiverProfile.id)) {
            fetchedTeammates.push(receiverProfile);
            teammateIds.add(receiverProfile.id);
          }
        } else if (invite.receiver_email === user.email) {
          // Current user is receiver, sender is teammate
          if (invite.sender_profile && !teammateIds.has(invite.sender_profile.id)) {
            fetchedTeammates.push({
              id: invite.sender_profile.id,
              first_name: invite.sender_profile.first_name,
              last_name: invite.sender_profile.last_name,
              avatar_url: invite.sender_profile.avatar_url,
              email: invite.sender_profile.email,
            });
            teammateIds.add(invite.sender_profile.id);
          }
        }
      }
      setTeammates(fetchedTeammates);

      // Fetch pending invitations sent by current user
      const { data: sentInvites, error: sentInvitesError } = await supabase
        .from('team_invitations')
        .select('id, receiver_email, status, created_at')
        .eq('sender_id', user.id)
        .eq('status', 'pending');
      if (sentInvitesError) throw sentInvitesError;
      setSentInvitations(sentInvites);

      // Fetch pending invitations received by current user
      const { data: receivedInvites, error: receivedInvitesError } = await supabase
        .from('team_invitations')
        .select(`
          id,
          sender_id,
          receiver_email,
          status,
          created_at,
          sender_profile:sender_id(id, first_name, last_name, avatar_url, email)
        `)
        .eq('receiver_email', user.email)
        .eq('status', 'pending');
      if (receivedInvitesError) throw receivedInvitesError;
      setReceivedInvitations(receivedInvites);

    } catch (error: any) {
      console.error('Error fetching teammates and invitations:', error);
      toast.error(`Failed to load team data: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTeammatesAndInvitations();
  }, [fetchTeammatesAndInvitations]);

  const handleInvitationAction = async (inviteId: string, status: 'accepted' | 'declined') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success(`Invitation ${status}.`);
      fetchTeammatesAndInvitations(); // Refresh lists
    } catch (error: any) {
      console.error(`Error ${status} invitation:`, error);
      toast.error(`Failed to ${status} invitation: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarFallback = (profile: UserProfile) => {
    return (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') || profile.email?.[0]?.toUpperCase();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Workspace Users</h2>
      <p className="text-muted-foreground">Manage your team and invitations.</p>

      <Button onClick={() => setIsInviteDialogOpen(true)} className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" /> Invite Teammate
      </Button>

      <InviteTeammateDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onInviteSent={fetchTeammatesAndInvitations}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Teammates Section */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>My Teammates</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {loading ? (
                <p className="text-muted-foreground text-center">Loading teammates...</p>
              ) : teammates.length === 0 ? (
                <p className="text-muted-foreground text-center">No teammates yet. Send an invite!</p>
              ) : (
                <div className="space-y-4">
                  {teammates.map((teammate) => (
                    <Card key={teammate.id} className="bg-secondary text-secondary-foreground border-border">
                      <CardContent className="flex items-center p-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={teammate.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${teammate.email}`} alt={`${teammate.first_name} ${teammate.last_name}`} />
                          <AvatarFallback>{getAvatarFallback(teammate)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{teammate.first_name} {teammate.last_name}</h3>
                          <p className="text-sm text-muted-foreground">{teammate.email}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pending Invitations Section */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {loading ? (
                <p className="text-muted-foreground text-center">Loading invitations...</p>
              ) : (sentInvitations.length === 0 && receivedInvitations.length === 0) ? (
                <p className="text-muted-foreground text-center">No pending invitations.</p>
              ) : (
                <div className="space-y-4">
                  {receivedInvitations.map((invite) => (
                    <Card key={invite.id} className="bg-secondary text-secondary-foreground border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={invite.sender_profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${invite.sender_profile?.email}`} alt={invite.sender_profile?.email} />
                              <AvatarFallback>{getAvatarFallback(invite.sender_profile || { id: '', first_name: '', last_name: '', email: '' })}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{invite.sender_profile?.first_name} {invite.sender_profile?.last_name || invite.sender_profile?.email}</p>
                              <p className="text-sm text-muted-foreground">invited you</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleInvitationAction(invite.id, 'accepted')} disabled={loading}>
                              <Check className="h-5 w-5 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleInvitationAction(invite.id, 'declined')} disabled={loading}>
                              <X className="h-5 w-5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Received: {new Date(invite.created_at).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {sentInvitations.map((invite) => (
                    <Card key={invite.id} className="bg-secondary text-secondary-foreground border-border">
                      <CardContent className="p-4">
                        <p className="font-semibold">Invitation sent to {invite.receiver_email}</p>
                        <p className="text-sm text-muted-foreground">Status: {invite.status}</p>
                        <p className="text-xs text-muted-foreground">Sent: {new Date(invite.created_at).toLocaleDateString()}</p>
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

export default Users;