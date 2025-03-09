"use client";

import { useEffect, useState } from "react";
import { TaskTrackerComponent } from "../components/task-tracker";
import { LandingPage } from "@/components/landing-page";
import { auth } from "@/lib/firebaseConfig";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  return isAuthenticated ? <TaskTrackerComponent /> : <LandingPage />;
}
