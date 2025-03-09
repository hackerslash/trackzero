"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        <p className="text-white mb-6">This feature is currently under development.</p>
        <Button
          type="button"
          onClick={() => router.back()}
          className="text-white hover:bg-gray-700"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
