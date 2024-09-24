"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Settings, Book, Info, User, LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface JournalEntry {
  timestamp: string;
  text: string;
}

type CompletedTasks = Record<string, number>;
type JournalEntries = Record<string, JournalEntry[]>;

export function TaskTrackerComponent() {
  const [showSettings, setShowSettings] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({});
  const [journalEntries, setJournalEntries] = useState<JournalEntries>({});
  const [streak, setStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User authenticated:", user.uid);

        // Load localStorage data first (for immediate UI feedback)
        loadLocalData();

        // Then load data from Firestore
        loadUserData(user.uid);
      } else {
        setUserId(null);
        // Clear local data when user is not authenticated
        clearLocalData();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Data loaded from Firestore:", userData);

      // Set only if Firestore data exists
      if (userData.tasks) setTasks(userData.tasks);
      if (userData.completedTasks) setCompletedTasks(userData.completedTasks);
      if (userData.journalEntries) setJournalEntries(userData.journalEntries);

      // Update local storage with Firestore data
      localStorage.setItem("tasks", JSON.stringify(userData.tasks || []));
      localStorage.setItem(
        "completedTasks",
        JSON.stringify(userData.completedTasks || {})
      );
      localStorage.setItem(
        "journalEntries",
        JSON.stringify(userData.journalEntries || {})
      );
    } else {
      console.log("No Firestore data found for user. Creating new document.");

      // Load data from local storage
      const localData = loadLocalData();

      // Create a new user document with data from local storage
      try {
        await setDoc(userDocRef, {
          tasks: localData.tasks || [],
          completedTasks: localData.completedTasks || {},
          journalEntries: localData.journalEntries || {},
          username: localData.username || "",
        });
        console.log("New user document created in Firestore");
      } catch (error) {
        console.error("Error creating new user document:", error);
      }
    }

    // Mark data as fully loaded before allowing updates
    setIsLoaded(true);
  };

  // Helper function to load data from local storage
  const loadLocalData = () => {
    const storedTasks = localStorage.getItem("tasks");
    const storedCompletedTasks = localStorage.getItem("completedTasks");
    const storedJournalEntries = localStorage.getItem("journalEntries");
    const storedUsername = localStorage.getItem("username");
    
    setUsername(storedUsername || "");

    return {
      tasks: storedTasks ? JSON.parse(storedTasks) : [],
      completedTasks: storedCompletedTasks
        ? JSON.parse(storedCompletedTasks)
        : {},
      journalEntries: storedJournalEntries
        ? JSON.parse(storedJournalEntries)
        : {},
      username: storedUsername || "",
    };
  };

  const clearLocalData = () => {
    localStorage.removeItem("tasks");
    localStorage.removeItem("completedTasks");
    localStorage.removeItem("journalEntries");
    localStorage.removeItem("username");
    localStorage.removeItem("lastAccessDate");
    
    setTasks([]);
    setCompletedTasks({});
    setJournalEntries({});
    setUsername("");
  };

  const saveToFirestore = async () => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      try {
        await updateDoc(userDocRef, {
          tasks,
          completedTasks,
          journalEntries,
          username,
        });
        console.log("Data updated:", {
          tasks,
          completedTasks,
          journalEntries,
          username,
        });
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  useEffect(() => {
    // Only save to Firestore if data is fully loaded
    if (isLoaded && userId) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
      localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
      localStorage.setItem("lastAccessDate", today);
      calculateStreak(completedTasks);
      saveToFirestore(); // Only save after data is loaded
    }
  }, [tasks, completedTasks, journalEntries, isLoaded, userId]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) => [
        { id: Date.now(), text: newTask, completed: false },
        ...prevTasks,
      ]);
      setNewTask("");
      setShowSettings(false);
    }
  };

  const toggleTask = (id: number) => {
    const today = new Date().toISOString().split("T")[0];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    setCompletedTasks((prevCompletedTasks) => {
      const updatedTasks = tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      const completedToday = updatedTasks.filter(
        (task: Task) => task.completed
      ).length;
      return { ...prevCompletedTasks, [today]: completedToday };
    });
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task: Task) => task.id !== id);
    setTasks(updatedTasks);

    const today = new Date().toISOString().split("T")[0];
    const completedToday = updatedTasks.filter(
      (task: Task) => task.completed
    ).length;
    setCompletedTasks({ ...completedTasks, [today]: completedToday });
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim() !== "") {
      const today = new Date().toISOString().split("T")[0];
      const newEntry: JournalEntry = {
        timestamp: new Date().toISOString(),
        text: journalEntry,
      };
      setJournalEntries((prev) => ({
        ...prev,
        [today]: [...(prev[today] || []), newEntry],
      }));
      setJournalEntry("");
      setShowJournal(false);
    }
  };

  const calculateStreak = (completedTasks: CompletedTasks) => {
    const today = new Date();
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      if (completedTasks[date] && completedTasks[date] > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const handleLogout = async () => {
    try {
      if (userId) {
        const userDocRef = doc(db, "users", userId); // Reference to the user's document
        await updateDoc(userDocRef, {
          lastAccess: new Date().toISOString().split("T")[0], // Update the lastAccess field with server timestamp
        });
      }
      await auth.signOut();
      clearLocalData();
      setShowUserPopover(false);
      setUserId(null); // Clear the userId state
      router.push(`/signin`); // Navigate to sign-in page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getActivityColor = (completedCount: number): string => {
    if (completedCount === 0) return "bg-gray-700";
    if (completedCount === 1) return "bg-green-200";
    if (completedCount === 2) return "bg-green-300";
    if (completedCount === 3) return "bg-green-400";
    if (completedCount === 4) return "bg-green-500";
    if (completedCount === 5) return "bg-green-600";
    return "bg-green-700"; // 6 or more completed tasks
  };

  const generateCalendar = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    const calendar = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let month = 0; month < 12; month++) {
      const monthCells = [];
      const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(today.getFullYear(), month, day);
        const dateString = date.toISOString().split("T")[0];
        const completedCount = completedTasks[dateString] || 0;
        let color = "bg-gray-800"; // Default color for future dates

        if (date <= today && date >= oneYearAgo) {
          color = getActivityColor(completedCount);
        } else if (date < oneYearAgo) {
          color = "bg-gray-900"; // Dates more than a year ago
        }

        monthCells.push(
          <TooltipProvider key={dateString}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`w-3 h-3 ${color} rounded-sm`}
                  onClick={() => setSelectedDate(dateString)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${dateString}: ${completedCount} tasks completed`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      calendar.push(
        <div key={`month-${month}`} className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">{months[month]}</div>
          <div className="grid grid-cols-7 gap-1">{monthCells}</div>
        </div>
      );
    }

    return calendar;
  }, [completedTasks]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center z-10">
        <div className="text-xl">TrackZero </div>
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

      {/* Main content */}
      <main className="flex-grow p-4 max-w-3xl mx-auto w-full flex flex-col justify-between">
        <div>
          {/* Streak */}
          <div className="mb-4 text-center">
            <span className="text-2xl font-bold">{streak}</span> day streak
          </div>

          {/* Settings */}
          {showSettings && (
            <div className="mb-4 flex space-x-2 transition-all duration-300 ease-in-out">
              <Input
                type="text"
                placeholder="Add a target"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
                className="flex-grow bg-gray-700 text-white placeholder-gray-400"
              />
              <Button variant="secondary" onClick={addTask}>
                <Plus />
              </Button>
            </div>
          )}

          {/* Task List or No Tasks Message */}
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center space-x-2 p-2 bg-gray-800 rounded transition-all duration-300 ease-in-out hover:bg-gray-700 group"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-grow cursor-pointer ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">
                  Add specific targets using the{" "}
                  <span className="text-white">⚙️</span> icon
                </p>
              </CardContent>
            </Card>
          )}

          {/* Journal */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowJournal(!showJournal)}
              className="bg-gray-700 text-white hover:bg-green-300"
            >
              <Book className="h-6 w-6 mr-2" />
              Journal
            </Button>
          </div>

          {showJournal && (
            <div className="mt-4 space-y-2 transition-all duration-300 ease-in-out">
              <Input
                type="text"
                placeholder="What did you do?"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="w-full bg-gray-700 text-white placeholder-gray-400"
              />
              <Button variant="secondary" onClick={saveJournalEntry}>
                Save Entry
              </Button>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Activity Calendar</h2>
          <div className="flex flex-wrap justify-between gap-2 overflow-x-auto">
            {generateCalendar}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center mt-auto">
        <p>&copy; 2023 Task Tracker. All rights reserved.</p>
      </footer>

      {/* Journal Entries Popup */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              Journal Entries for {selectedDate}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            {selectedDate &&
            journalEntries[selectedDate] &&
            journalEntries[selectedDate].length > 0 ? (
              journalEntries[selectedDate].map((entry, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-green-400 text-sm mb-1">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-200 font-light leading-relaxed">
                    {entry.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No journal entries for this day.</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
