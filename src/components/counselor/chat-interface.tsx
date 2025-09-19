"use client"

import { useState, useRef, useEffect, use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { aiCareerCounselor } from "@/ai/flows/ai-career-counselor"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Loader2, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
  question: z.string().min(1, "Message cannot be empty"),
})

type Message = {
  id: number
  text: string
  isUser: boolean
  isLoading?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { id: Date.now(), text: values.question, isUser: true }
    const loadingMessage: Message = { id: Date.now() + 1, text: "...", isUser: false, isLoading: true }
    
    setMessages((prev) => [...prev, userMessage, loadingMessage])
    form.reset()

    try {
      const result = await aiCareerCounselor({ question: values.question })
      const aiMessage: Message = { id: Date.now() + 2, text: result.answer, isUser: false }
      setMessages((prev) => [...prev.filter(m => !m.isLoading), aiMessage])
    } catch (error) {
      console.error("Error with AI Counselor:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a response. Please try again.",
      })
      setMessages((prev) => prev.filter(m => !m.isLoading))
    }
  }

  return (
    <>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-4",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md p-3 rounded-lg",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  )}
                </div>
                 {message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-center gap-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Type your message here..." {...field} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </>
  )
}
