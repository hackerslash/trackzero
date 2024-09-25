// components/navbar.tsx
import { Button } from "@/components/ui/button";
import { Settings, Info, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavbarProps {
  username: string;
  showUserPopover: boolean;
  setShowUserPopover: (open: boolean) => void;
  handleLogout: () => void;
  showSettings: boolean;
  setShowSettings: (open: boolean) => void;
}

export function Navbar({
  username,
  showUserPopover,
  setShowUserPopover,
  handleLogout,
  showSettings,
  setShowSettings,
}: NavbarProps) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center z-10">
      <div className="text-xl">TrackZero</div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4 mr-2" />
          About
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-6 w-6" />
        </Button>
        <Popover open={showUserPopover} onOpenChange={setShowUserPopover}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-800 border-gray-700">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-white">
                Welcome, {username}!
              </p>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}