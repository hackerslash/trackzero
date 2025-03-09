"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white drop-shadow-sm cursor-pointer font-body">
          TrackZero
        </div>
        <div className="space-x-4">
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
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Track Your Progress,<br />One Day at a Time
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Never have a zero day again. Start your journey to consistent progress.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6"
              onClick={() => router.push("/signup")}
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-indigo-400 mb-3">Inspired by the Reddit Legend</h2>
            <p className="text-gray-400 italic">
              "No more zero days. What's a zero day? A zero day is when you don't do a single thing towards whatever dream or goal or want or whatever that you got going on. No more zeros."
            </p>
            <p className="text-sm text-gray-500 mt-2">
              — /u/ryans01's legendary Reddit comment that started a movement
            </p>
            <a 
              href="http://www.reddit.com/r/getdisciplined/comments/1q96b5/i_just_dont_care_about_myself/cdah4af"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Read the original comment →
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * (index + 2) }}
            >
              <feature.icon className="h-12 w-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Track Daily Progress",
    description: "Set and track your daily goals with our intuitive interface.",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    title: "Journal Your Thoughts",
    description: "Keep a daily journal to reflect on your progress and thoughts.",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    title: "Visual Progress",
    description: "See your progress with beautiful activity visualizations.",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];
