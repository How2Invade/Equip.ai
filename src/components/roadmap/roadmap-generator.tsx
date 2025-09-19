"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { generateCareerRoadmap } from "@/ai/flows/career-roadmap-generator"
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
import { CardContent } from "@/components/ui/card"

const formSchema = z.object({
  skills: z.string().min(5, {
    message: "Please list some of your skills and experiences.",
  }),
  desiredJobTitle: z.string().min(2, {
    message: "Please enter a desired job title.",
  }),
})

interface RoadmapGeneratorProps {
  setRoadmap: (roadmap: string | null) => void
  setIsLoading: (isLoading: boolean) => void
}

export function RoadmapGenerator({ setRoadmap, setIsLoading }: RoadmapGeneratorProps) {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: "",
      desiredJobTitle: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setRoadmap(null)
    try {
      const result = await generateCareerRoadmap(values)
      setRoadmap(result.roadmap)
    } catch (error) {
      console.error("Error generating roadmap:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not generate the roadmap. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Skills & Experiences</FormLabel>
                <FormControl>
                  <Textarea placeholder="List your skills, experiences, and projects, separated by commas... (e.g., Python, Led a team project, Built a web app with React)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desiredJobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Product Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Roadmap"
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  )
}
