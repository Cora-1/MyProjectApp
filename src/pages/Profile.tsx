import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const Profile = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ first_name: '', last_name: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile.');
        } else if (data) {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } else {
      toast.success('Profile updated successfully!');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Your Profile</h2>
      <p className="text-muted-foreground">Manage your personal information and avatar.</p>

      <Card className="bg-card text-card-foreground border-border max-w-lg mx-auto">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name || user?.email}`} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>{(profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') || user?.email?.[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.first_name} {profile.last_name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" value={profile.first_name} onChange={handleInputChange} className="bg-input text-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" value={profile.last_name} onChange={handleInputChange} className="bg-input text-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input id="avatar_url" value={profile.avatar_url} onChange={handleInputChange} placeholder="e.g., https://example.com/my-avatar.jpg" className="bg-input text-foreground border-border" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile} className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;