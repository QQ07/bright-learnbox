import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, Layers, TestTube, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { getUserName, getUserRole, clearUserData } from '@/lib/auth';
import { api } from '@/services/api';

export const SidebarNav = () => {
  const [expanded, setExpanded] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const userName = getUserName() || 'User';
  const userRole = getUserRole() || 'learner';
  
  const toggleSidebar = () => setExpanded(!expanded);
  
  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }
    
    // Clear user data from localStorage
    clearUserData();
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Redirect to login page
    navigate('/', { replace: true });
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-full bg-sidebar min-h-screen border-r border-sidebar-border flex flex-col",
        "transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center", !expanded && "justify-center w-full")}>
          <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center">
            <span className="text-primary font-bold text-xl">L</span>
          </div>
          {expanded && (
            <span className="ml-2 font-semibold text-foreground">LearnBox</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("text-muted-foreground hover:text-foreground", 
            !expanded && "absolute right-0 -mr-4 bg-background border shadow-sm"
          )}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>
      
      <Separator className="my-2" />
      
      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <NavItem to="/self-space" icon={<Book />} label="Self Space" expanded={expanded} />
          <NavItem to="/classrooms" icon={<Layers />} label="Classrooms" expanded={expanded} />
          <NavItem to="/tests" icon={<TestTube />} label="Tests" expanded={expanded} />
        </nav>
      </div>
      
      {/* User Profile */}
      <div className={cn(
        "mt-auto p-4 flex items-center", 
        expanded ? "justify-between" : "justify-center"
      )}>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary font-medium">
              {userName.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {expanded && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground truncate">
                {userName}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {userRole === 'mentor' ? 'Teacher' : 'Student'}
              </span>
            </div>
          )}
        </div>
        
        {expanded && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <LogOut size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}

const NavItem = ({ to, icon, label, expanded }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => cn(
      "flex items-center py-3 px-4 rounded-xl text-foreground",
      "transition-all duration-200 group",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-sidebar-accent",
      !expanded && "justify-center"
    )}
  >
    <div className={cn(
      "flex items-center justify-center w-6 h-6",
      "text-inherit group-hover:text-primary transition-colors"
    )}>
      {icon}
    </div>
    {expanded && <span className="ml-3">{label}</span>}
  </NavLink>
);

export default SidebarNav;
