import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight, BarChart, Bot, Map, User } from "lucide-react"
import { TrendPredictor } from "@/components/dashboard/trends-predictor"
import { SkillsLagScore } from "@/components/dashboard/skills-lag-score"
import { PersonaGenerator } from "@/components/dashboard/persona-generator"

export default function Dashboard() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome to EQUIP.AI</CardTitle>
            <CardDescription>
              Here's your career snapshot. Ready to plan your next move?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/roadmap">View Your Roadmap</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Counselor</CardDescription>
            <CardTitle className="text-2xl">Chat Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Get instant career advice.
            </div>
          </CardContent>
          <CardContent>
            <Button size="sm" asChild>
              <Link href="/dashboard/counselor">
                <Bot className="mr-2 h-4 w-4" /> Start Chat
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profile Analysis</CardDescription>
            <CardTitle className="text-2xl">Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Analyze your skills and experience.
            </div>
          </CardContent>
          <CardContent>
            <Button size="sm" asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" /> Go to Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Career Roadmap</CardDescription>
            <CardTitle className="text-2xl">Build Your Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Generate a step-by-step guide.
            </div>
          </CardContent>
          <CardContent>
            <Button size="sm" asChild>
              <Link href="/dashboard/roadmap">
                <Map className="mr-2 h-4 w-4" /> Generate Roadmap
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Industry Trend Predictor</CardTitle>
            <CardDescription>
              2-year projections for emerging and declining competencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendPredictor />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Skills Lag Score</CardTitle>
            <CardDescription>
              Analyze how your skills compare to the industry average.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsLagScore />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card>
            <CardHeader>
              <CardTitle>Career Persona</CardTitle>
              <CardDescription>
                Generate a career persona to understand your strengths and weaknesses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonaGenerator />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
