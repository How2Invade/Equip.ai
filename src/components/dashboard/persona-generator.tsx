"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { generatePersona, PersonaGeneratorOutput } from "@/ai/flows/persona-generator"
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
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const formSchema = z.object({
  skills: z.string().min(5, "Please list some of your skills."),
  desiredJob: z.string().min(2, "Please enter a desired job."),
})

export function PersonaGenerator() {
  const [persona, setPersona] = useState<PersonaGeneratorOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: "",
      desiredJob: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPersona(null)
    try {
      const result = await generatePersona(values)
      setPersona(result)
    } catch (error) {
      console.error("Error generating persona:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not generate a persona. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAvatar = () => {
    if (!persona) return null;
    const avatarId = persona.gender === 'boy' ? 'persona-avatar-boy' : 'persona-avatar-girl';
    return PlaceHolderImages.find(img => img.id === avatarId);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Skills</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List your skills, separated by commas..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desiredJob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Job</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Persona"
            )}
          </Button>
        </form>
      </Form>
      
      {isLoading && (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {persona && (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <Avatar className="h-32 w-32 border-4 border-primary">
                            <AvatarImage src={getAvatar()?.imageUrl} alt={persona.name} data-ai-hint={getAvatar()?.imageHint} />
                            <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <CardTitle className="text-3xl">{persona.name}</CardTitle>
                        <CardDescription className="text-lg">{persona.summary}</CardDescription>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl">
                                <ThumbsUp className="mr-2 text-green-500" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {persona.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
                           </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl">
                                <ThumbsDown className="mr-2 text-red-500" />
                                Areas for Growth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {persona.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                           </ul>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
