import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileAnalyzer } from "@/components/profile/profile-analyzer"
import { VoiceConsultation } from "@/components/profile/voice-consultation"
import { PortfolioGenerator } from "@/components/profile/portfolio-generator"
import { CompanyCultureMatcher } from "@/components/profile/company-culture-matcher"

export default function ProfilePage() {
  return (
    <Tabs defaultValue="analyzer" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="analyzer">Profile Analyzer</TabsTrigger>
        <TabsTrigger value="voice">Voice Consultation</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio Generator</TabsTrigger>
        <TabsTrigger value="culture">Culture Match</TabsTrigger>
      </TabsList>
      <TabsContent value="analyzer">
        <Card>
          <CardHeader>
            <CardTitle>Profile Analyzer</CardTitle>
            <CardDescription>
              Analyze your LinkedIn, Github profile, or resume to extract and map skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileAnalyzer />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="voice">
        <Card>
          <CardHeader>
            <CardTitle>Voice Career Consultation</CardTitle>
            <CardDescription>
              Record your career aspirations and concerns for AI analysis and personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceConsultation />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="portfolio">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Generator</CardTitle>
            <CardDescription>
              Dynamically create a resume based on your skills and achievements. (Mockup)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioGenerator />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="culture">
        <Card>
          <CardHeader>
            <CardTitle>Company Culture Matching</CardTitle>
            <CardDescription>
              Assess your ideal workplace culture and find organizations that align with your values. (Mockup)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyCultureMatcher />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
