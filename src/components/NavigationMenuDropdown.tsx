import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const NavigationMenuDropdown: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/leadership-modules', label: 'Leadership Modules' },
    { path: '/messages', label: 'My Feedback' },
    { path: '/team-messages', label: 'Team Messages' },
    { path: '/feedback', label: 'Feedback History' },
    { path: '/users', label: 'Users' },
    { path: '/profile', label: 'Profile' },
  ];

  const getActiveItemLabel = () => {
    const activeItem = navItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.label : 'Navigation';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline">{getActiveItemLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItems.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <Link to={item.path} className={currentPath === item.path ? 'bg-accent text-accent-foreground' : ''}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenuDropdown;