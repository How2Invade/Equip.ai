"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { analyzeSkillsLag } from "@/ai/flows/skills-lag-score"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "../ui/card"

const formSchema = z.object({
  userSkills: z.string().min(5, {
    message: "Please list some of your skills.",
  }),
  desiredCareer: z.string().min(2, {
    message: "Please enter a desired career.",
  }),
})

export function SkillsLagScore() {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSkills: "",
      desiredCareer: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysis(null)
    try {
      const result = await analyzeSkillsLag(values)
      setAnalysis(result.skillGaps)
    } catch (error) {
      console.error("Error analyzing skills lag:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not analyze skills. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Skills</FormLabel>
                <FormControl>
                  <Textarea placeholder="List your skills, separated by commas... (e.g., Python, React, Project Management)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desiredCareer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Career</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Data Scientist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Skill Gaps"
            )}
          </Button>
        </form>
      </Form>
      
      {analysis && (
        <Card>
          <CardContent className="p-6">
             <h3 className="text-lg font-semibold mb-2">Skill Gap Analysis</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {analysis}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
