"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { analyzeProfile, AnalyzeProfileOutput } from "@/ai/flows/profile-analyzer"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  profileData: z.string().min(50, {
    message: "Profile data must be at least 50 characters.",
  }),
})

export function ProfileAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeProfileOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileData: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysis(null)
    try {
      const result = await analyzeProfile(values)
      setAnalysis(result)
    } catch (error) {
      console.error("Error analyzing profile:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not analyze your profile. Please try again.",
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
            name="profileData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Profile Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your profile data from LinkedIn, Github, or your resume here..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Profile"
            )}
          </Button>
        </form>
      </Form>
      
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Experience Summary</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {analysis.experienceSummary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
