import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InviteTeammateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: () => void; // Callback to refresh lists after sending an invite
}

const InviteTeammateDialog: React.FC<InviteTeammateDialogProps> = ({ isOpen, onClose, onInviteSent }) => {
  const { user } = useAuth();
  const [receiverEmail, setReceiverEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    if (!user) {
      toast.error("You must be logged in to send invitations.");
      return;
    }
    if (!receiverEmail.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    if (receiverEmail.trim() === user.email) {
      toast.error("You cannot invite yourself.");
      return;
    }

    setLoading(true);
    try {
      // Check if an invitation already exists or if the user is already a teammate
      const { data: existingInvites, error: existingInvitesError } = await supabase
        .from('team_invitations')
        .select('id, status')
        .or(`and(sender_id.eq.${user.id},receiver_email.eq.${receiverEmail}),and(sender_id.eq.(select id from auth.users where email='${receiverEmail}'),receiver_email.eq.${user.email})`);

      if (existingInvitesError) throw existingInvitesError;

      if (existingInvites && existingInvites.length > 0) {
        const hasPending = existingInvites.some(invite => invite.status === 'pending');
        const hasAccepted = existingInvites.some(invite => invite.status === 'accepted');

        if (hasAccepted) {
          toast.info(`${receiverEmail} is already your teammate.`);
          onClose();
          return;
        }
        if (hasPending) {
          toast.info(`An invitation to ${receiverEmail} is already pending.`);
          onClose();
          return;
        }
      }

      // Check if the receiver email exists as a user in auth.users
      const { data: receiverUser, error: receiverUserError } = await supabase
        .from('profiles') // Using profiles table to check for existing users
        .select('id')
        .eq('email', receiverEmail)
        .single();

      if (receiverUserError && receiverUserError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw receiverUserError;
      }

      const { error: insertError } = await supabase
        .from('team_invitations')
        .insert({
          sender_id: user.id,
          receiver_email: receiverEmail,
          status: 'pending',
        });

      if (insertError) {
        throw insertError;
      }

      toast.success(`Invitation sent to ${receiverEmail}!`);
      setReceiverEmail('');
      onInviteSent();
      onClose();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(`Failed to send invitation: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite to your team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="teammate@example.com"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="col-span-3 bg-input text-foreground border-border"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSendInvite} disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeammateDialog;