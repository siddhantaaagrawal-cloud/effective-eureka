import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, UserPlus, Copy, Key } from 'lucide-react';
import LeaderboardItem from '@/components/LeaderboardItem';
import GradientGlow from '@/components/GradientGlow';
import { useToast } from '@/hooks/use-toast';

export default function FriendsPage() {
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ['/api/friends'],
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/friends/leaderboard'],
  });

  const addFriendMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/friends/add', { code });
      return response.json();
    },
    onSuccess: (newFriend) => {
      queryClient.invalidateQueries({ queryKey: ['/api/friends'] });
      queryClient.invalidateQueries({ queryKey: ['/api/friends/leaderboard'] });
      setIsAddDialogOpen(false);
      setFriendCodeInput('');
      toast({
        title: 'Friend added!',
        description: `You're now connected with ${newFriend.name || 'this user'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add friend',
        description: error.message || 'Please check the code and try again',
        variant: 'destructive',
      });
    },
  });

  const handleAddFriend = () => {
    if (friendCodeInput.length === 14) {
      addFriendMutation.mutate(friendCodeInput);
    }
  };

  const copyUserCode = () => {
    if (currentUser?.userCode) {
      navigator.clipboard.writeText(currentUser.userCode);
      toast({
        title: 'Code copied!',
        description: 'Your 14-digit code has been copied to clipboard',
      });
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="green" position="top" size="lg" />
      
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Friends & Community</h1>
          <p className="text-sm text-muted-foreground">
            Compare progress and stay motivated together
          </p>
        </div>

        {currentUser && (
          <Card className="p-4 mb-6 backdrop-blur-xl bg-card/50 border-white/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <Label className="text-sm font-semibold">Your 14-Digit Code</Label>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background/50 p-3 rounded-lg">
                  <div className="font-mono font-bold text-lg tracking-wider" data-testid="text-my-code">
                    {currentUser.userCode}
                  </div>
                </div>
                <Button
                  onClick={copyUserCode}
                  variant="outline"
                  size="icon"
                  data-testid="button-copy-my-code"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with friends so they can add you!
              </p>
            </div>
          </Card>
        )}

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="friends" data-testid="tab-friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2 pr-4">
                {leaderboardLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading leaderboard...
                  </div>
                ) : leaderboard.length === 0 ? (
                  <Card className="p-8 text-center backdrop-blur-xl bg-card/50 border-white/20">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Add friends to see the leaderboard!
                    </p>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-add-friend-leaderboard">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Friend
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a Friend</DialogTitle>
                          <DialogDescription>
                            Enter your friend's 14-digit code to connect with them
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="friendCode">Friend's 14-Digit Code</Label>
                            <Input
                              id="friendCode"
                              data-testid="input-add-friend-code"
                              value={friendCodeInput}
                              onChange={(e) => setFriendCodeInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
                              placeholder="12345678901234"
                              maxLength={14}
                              autoComplete="off"
                            />
                            {friendCodeInput && friendCodeInput.length !== 14 && (
                              <p className="text-xs text-muted-foreground">
                                {14 - friendCodeInput.length} more digits needed
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={handleAddFriend}
                            disabled={friendCodeInput.length !== 14 || addFriendMutation.isPending}
                            className="w-full"
                            data-testid="button-submit-add-friend"
                          >
                            {addFriendMutation.isPending ? 'Adding...' : 'Add Friend'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Card>
                ) : (
                  leaderboard.map((user: any) => (
                    <LeaderboardItem
                      key={user.id}
                      rank={user.rank}
                      name={user.name || `User ${user.userCode?.slice(0, 4)}`}
                      avatar={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                      score={user.score}
                      isCurrentUser={user.id === currentUser?.id}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="friends">
            <div className="space-y-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" data-testid="button-add-friend">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Friend</DialogTitle>
                    <DialogDescription>
                      Enter your friend's 14-digit code to connect with them
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="friendCodeDialog">Friend's 14-Digit Code</Label>
                      <Input
                        id="friendCodeDialog"
                        data-testid="input-friend-code-dialog"
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
                        placeholder="12345678901234"
                        maxLength={14}
                        autoComplete="off"
                      />
                      {friendCodeInput && friendCodeInput.length !== 14 && (
                        <p className="text-xs text-muted-foreground">
                          {14 - friendCodeInput.length} more digits needed
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleAddFriend}
                      disabled={friendCodeInput.length !== 14 || addFriendMutation.isPending}
                      className="w-full"
                      data-testid="button-add-friend-submit"
                    >
                      {addFriendMutation.isPending ? 'Adding...' : 'Add Friend'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-3 pr-4">
                  {friendsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading friends...
                    </div>
                  ) : friends.length === 0 ? (
                    <Card className="p-8 text-center backdrop-blur-xl bg-card/50 border-white/20">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No friends yet. Add friends using their 14-digit code!
                      </p>
                    </Card>
                  ) : (
                    friends.map((friend: any) => (
                      <Card
                        key={friend.id}
                        className="p-4 backdrop-blur-xl bg-card/50 border-white/20"
                        data-testid={`card-friend-${friend.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage 
                              src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.id}`}
                              alt={friend.name || 'Friend'} 
                            />
                            <AvatarFallback>
                              {friend.name ? friend.name[0].toUpperCase() : 'F'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold">
                              {friend.name || `User ${friend.userCode?.slice(0, 4)}`}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              Code: {friend.userCode}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
