"use client"

import { useState, useRef, useEffect } from "react"
import { voiceCareerConsultation, VoiceCareerConsultationOutput } from "@/ai/flows/voice-career-consultation"
import { Button } from "@/components/ui/button"
import { Loader2, Mic, Square, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function VoiceConsultation() {
  const [analysis, setAnalysis] = useState<VoiceCareerConsultationOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const { toast } = useToast()

  useEffect(() => {
    // Check for microphone permission on component mount
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
        setHasPermission(permissionStatus.state === 'granted');
        permissionStatus.onchange = () => {
            setHasPermission(permissionStatus.state === 'granted');
        };
    });
  }, []);

  const requestPermission = async () => {
     try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        // We have to stop the tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        return true;
     } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasPermission(false);
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Microphone access is required for voice consultation.",
        });
        return false;
     }
  }

  const startRecording = async () => {
    if (isRecording) return;
    if (!hasPermission) {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) return;
    }

    setAnalysis(null);
    setAudioDataUri(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)
    audioChunksRef.current = []

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = () => {
        setAudioDataUri(reader.result as string)
      }
      stream.getTracks().forEach(track => track.stop()); // Release microphone
    }

    mediaRecorderRef.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleAnalyze = async () => {
    if (!audioDataUri) return;
    setIsLoading(true)
    setAnalysis(null)
    try {
      const result = await voiceCareerConsultation({ audioDataUri })
      setAnalysis(result)
    } catch (error) {
      console.error("Error with voice consultation:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not analyze your recording. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
        if (isAudioPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsAudioPlaying(!isAudioPlaying);
    }
  };

  useEffect(() => {
    if(audioDataUri) {
        audioRef.current = new Audio(audioDataUri);
        audioRef.current.onended = () => setIsAudioPlaying(false);
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }
  }, [audioDataUri]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        {!isRecording ? (
          <Button onClick={startRecording} size="lg" className="rounded-full w-24 h-24">
            <Mic className="h-10 w-10" />
            <span className="sr-only">Start Recording</span>
          </Button>
        ) : (
          <Button onClick={stopRecording} size="lg" variant="destructive" className="rounded-full w-24 h-24">
            <Square className="h-10 w-10" />
            <span className="sr-only">Stop Recording</span>
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          {isRecording ? "Recording... Click to stop." : "Click to start recording."}
        </p>
      </div>

      {audioDataUri && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={toggleAudioPlayback} size="icon" variant="ghost">
                {isAudioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <p className="text-sm font-medium">Your Recording</p>
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Recording"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Consultation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4>AI Analysis</h4>
                <p>{analysis.analysis}</p>
                <h4>Recommendations</h4>
                <p>{analysis.recommendations}</p>
                <h4>Skill Assessments</h4>
                <p>{analysis.skillAssessments}</p>
                <h4>Podcast Recommendations</h4>
                <p>{analysis.podcastRecommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
