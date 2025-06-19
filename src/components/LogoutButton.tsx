
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Failed",
          description: "There was an error logging you out. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
