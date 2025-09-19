"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { predictIndustryTrends } from "@/ai/flows/industry-trend-predictor"
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
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "../ui/card"

const formSchema = z.object({
  field: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
})

type TrendPrediction = {
  emergingCompetencies: string[]
  decliningCompetencies: string[]
}

export function TrendPredictor() {
  const [prediction, setPrediction] = useState<TrendPrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPrediction(null)
    try {
      const result = await predictIndustryTrends(values)
      setPrediction(result)
    } catch (error) {
      console.error("Error predicting trends:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not fetch trend predictions. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Industry or Field</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Software Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Trends"
            )}
          </Button>
        </form>
      </Form>
      
      {prediction && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <ArrowUp className="h-5 w-5 mr-2 text-green-500" />
                  Emerging Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.emergingCompetencies.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <ArrowDown className="h-5 w-5 mr-2 text-red-500" />
                  Declining Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.decliningCompetencies.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
