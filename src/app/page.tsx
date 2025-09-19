import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Bot, Map, BarChart, Mic, Briefcase, Users } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Career Counselor',
    description: 'Get real-time career guidance from our AI-powered counselor chat.',
  },
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    title: 'Personalized Roadmaps',
    description: 'Generate dynamic career roadmaps tailored to your skills and goals.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Skills Lag Score',
    description: 'Analyze how your skills stack up against industry standards.',
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: 'Voice Consultation',
    description: 'Record your career thoughts and get AI-driven analysis and advice.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Industry Trend Predictor',
    description: 'Stay ahead with 2-year projections on emerging job competencies.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Peer Comparison',
    description: 'Compare your progress with peers on a similar career journey.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">EquipAI</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 md:py-32">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-background via-blue-100/30 to-background dark:from-background dark:via-blue-900/10 dark:to-background"
            />
            <div className="container relative text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                    Navigate Your Future with AI
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
                    EquipAI is your personalized career co-pilot, leveraging cutting-edge AI to map your skills, recommend career paths, and prepare you for the evolving job market.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Button asChild size="lg" className="font-semibold">
                        <Link href="/dashboard">Get Started for Free</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="font-semibold">
                        <Link href="#features">Learn More</Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-card">
            <div className="container">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">A Smarter Way to Plan Your Career</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        From skill analysis to job market trends, EquipAI provides the tools you need to succeed.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-start text-left p-6 rounded-lg border bg-background hover:shadow-lg transition-shadow">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-8 bg-card">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by you. Powered by AI.
              </p>
              <p className="text-center text-sm text-muted-foreground">&copy; {new Date().getFullYear()} EquipAI. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
}
