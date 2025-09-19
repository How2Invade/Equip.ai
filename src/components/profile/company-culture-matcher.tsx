"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building, Users, Zap, Coffee, Clock } from "lucide-react"

const questions = [
  {
    id: "pace",
    question: "I prefer a work environment that is:",
    options: ["Fast-paced and dynamic", "Steady and predictable"],
  },
  {
    id: "collaboration",
    question: "I work best:",
    options: ["In a highly collaborative team", "Independently with clear goals"],
  },
  {
    id: "structure",
    question: "I thrive in an organization that has:",
    options: ["A flat hierarchy and fluid roles", "A clear structure and defined processes"],
  },
]

const mockCompanies = [
  { name: "Innovate Inc.", culture: "Fast-paced, Collaborative, Flat hierarchy", icon: <Zap className="h-6 w-6 text-primary" /> },
  { name: "Stable Corp.", culture: "Steady, Independent, Structured", icon: <Building className="h-6 w-6 text-primary" /> },
  { name: "Synergy Solutions", culture: "Fast-paced, Collaborative, Structured", icon: <Users className="h-6 w-6 text-primary" /> },
  { name: "Legacy Co.", culture: "Steady, Independent, Structured", icon: <Clock className="h-6 w-6 text-primary" /> },
  { name: "TeamUp Tech", culture: "Fast-paced, Collaborative, Flat hierarchy", icon: <Coffee className="h-6 w-6 text-primary" /> },
]

export function CompanyCultureMatcher() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleValueChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleShowResults = () => {
    if (Object.keys(answers).length === questions.length) {
      setShowResults(true)
    }
  }

  return (
    <div className="space-y-6">
      {!showResults ? (
        <div className="space-y-8">
          {questions.map(q => (
            <div key={q.id}>
              <Label className="text-base font-semibold">{q.question}</Label>
              <RadioGroup
                onValueChange={(value) => handleValueChange(q.id, value)}
                className="mt-4 space-y-2"
              >
                {q.options.map(opt => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                    <Label htmlFor={`${q.id}-${opt}`} className="font-normal">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={handleShowResults} disabled={Object.keys(answers).length !== questions.length}>
            Find My Match
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Ideal Culture Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {Object.values(answers).map(answer => <li key={answer}>{answer}</li>)}
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold">Top Company Matches</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCompanies.slice(0, 3).map(company => (
              <Card key={company.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">{company.name}</CardTitle>
                  {company.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{company.culture}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Retake Assessment
          </Button>
        </div>
      )}
    </div>
  )
}
