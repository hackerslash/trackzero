'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function NoZeroDayWikiComponent() {
  return (
    <div className="min-h-72 bg-gray-900 text-gray-100 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-900">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">No Zero Day Philosophy</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">What is a Non-Zero Day?</h2>
              <p className="mb-4 text-white">
                A non-zero day is any day where you take at least one small action toward your goals. This can be as simple as writing one line of a report, reading a single page from a book, or doing one push-up. The point is that you've made some progress, however small, instead of doing nothing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">How It Works</h2>
              <p className="mb-4 text-white">
                This website lets you track your non-zero days visually, just like a GitHub streak. Each day that you complete a non-zero task, your streak continues, motivating you to maintain momentum. Miss a day? The streak resets, encouraging you to stay consistent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Why It Matters</h2>
              <p className="mb-4 text-white">
                The power of the non-zero day system lies in consistency. Small, consistent efforts compound over time to produce significant results. By using this tool, you can hold yourself accountable, see your progress, and stay on track to achieve your long-term goals.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">The Core Rules</h2>
              <ul className="list-disc pl-6 space-y-2 text-white">
                <li><strong>No Zero Days:</strong> Do something every day, no matter how small, to move toward your goals.</li>
                <li><strong>Be Grateful to the 3 You's:</strong> Thank your past self for good decisions, help your future self by taking actions today.</li>
                <li><strong>Forgive Yourself:</strong> Don't get bogged down by guilt. Forgive past mistakes and keep moving forward.</li>
                <li><strong>Exercise and Read:</strong> Take care of both your body and mind for better productivity and growth.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">How to Get Started</h2>
              <p className="mb-4 text-white">
                Simply create an account and start tracking your non-zero days! Use the streak feature to stay motivated and see how every small action contributes to your long-term success.
              </p>
            </section>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}