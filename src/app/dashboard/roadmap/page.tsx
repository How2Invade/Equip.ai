"use client"

import { useState } from "react"
import { RoadmapGenerator } from "@/components/roadmap/roadmap-generator"
import { RoadmapDisplay } from "@/components/roadmap/roadmap-display"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Career Roadmap Generator</CardTitle>
          <CardDescription>
            Enter your skills and desired job title to generate a personalized career roadmap.
          </CardDescription>
        </CardHeader>
        <RoadmapGenerator setRoadmap={setRoadmap} setIsLoading={setIsLoading} />
      </Card>
      
      {(isLoading || roadmap) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
            <CardDescription>
              Here are the recommended steps to achieve your career goals. Track your progress along the way.
            </CardDescription>
          </CardHeader>
          <RoadmapDisplay roadmap={roadmap} isLoading={isLoading} />
        </Card>
      )}
    </div>
  )
}
