// components/navbar.tsx
import { Button } from "@/components/ui/button";
import { Settings, LogOut, HelpCircle, BookOpen, FilePlus2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';

interface NavbarProps {
  username: string;
  showUserPopover: boolean;
  setShowUserPopover: (open: boolean) => void;
  handleLogout: () => void;
  showSettings: boolean;
  setShowSettings: (open: boolean) => void;
  setShowWiki: (open: boolean) => void;
  showWiki: boolean;
  email: string;
  isAuthenticated?: boolean;
}

export function Navbar({
  username,
  showUserPopover,
  setShowUserPopover,
  handleLogout,
  showSettings,
  setShowSettings,
  setShowWiki,
  showWiki,
  email,
  isAuthenticated = true,
}: NavbarProps) {
  const router = useRouter();
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center z-10">
      <div
        className="text-2xl font-bold text-white drop-shadow-sm cursor-pointer font-body"
        onClick={() => {
          if (showWiki) {
            setShowWiki(false);
          } else {
            window.location.href = "/";
          }
        }}
      >
        TrackZero
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWiki(!showWiki)}
            >
              <BookOpen className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FilePlus2 className="h-6 w-6" />
            </Button>
            <Popover open={showUserPopover} onOpenChange={setShowUserPopover}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={photoURL || `https://avatar.iran.liara.run/username?username=${username}`}
                      alt={username}
                    />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700">
                <div className="flex items-center gap-4 p-4 border-b border-gray-700">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={photoURL || `https://avatar.iran.liara.run/username?username=${username}`}
                      alt={username}
                    />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-white">{username}</p>
                    <p className="text-sm text-gray-400">{email}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
                    onClick={() => alert("Settings functionality is currently under development.")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
                    onClick={() => {
                      window.open('mailto:afridijnv19@gmail.com');
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-white hover:bg-gray-700"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
