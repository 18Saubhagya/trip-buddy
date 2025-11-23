'use client';

import { useState } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plane, 
  LogOut, 
  User, 
  Settings, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import {toast} from "react-hot-toast";

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function Navbar({ 
  userName = "John Doe", 
  userEmail = "john@example.com",
  userAvatar 
}: NavbarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
        const res = await axios.post("/api/users/logout");
        if (res.status === 200) {
            toast.success("Logout successful.");
            router.push("/login");
        }
    } catch (error) {
        toast.error("Logout failed.");
        console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Trip Buddy</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          {/*<div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search trips, destinations..."
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pl-10 h-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>*/}

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-slate-600">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{userName}</p>
                    <p className="text-xs leading-none text-slate-400">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {/*{isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search trips, destinations..."
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pl-10 h-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}*/}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-4">
            <div className="flex flex-col space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="h-10 w-10 border-2 border-slate-600">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-slate-400">{userEmail}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Bell className="mr-3 h-4 w-4" />
                  Notifications
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}