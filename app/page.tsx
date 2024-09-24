"use client";

import { TaskTrackerComponent } from "../components/task-tracker";
import withAuth from "@/components/withAuth";

function Home() {
  return <TaskTrackerComponent />;
}

export default withAuth(Home);
