"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Linkedin, Dribbble, Download } from "lucide-react"

const mockUserData = {
  name: "Alex Doe",
  title: "Aspiring Full-Stack Developer",
  summary: "A passionate developer with experience in building web applications using the MERN stack. Eager to learn and contribute to a fast-paced team.",
  skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Python"],
  experience: [
    {
      title: "Web Developer Intern",
      company: "Tech Solutions Inc.",
      duration: "Jun 2023 - Aug 2023",
      description: "Developed and maintained features for a client-facing web application. Collaborated with a team of developers in an agile environment."
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "A full-featured e-commerce site with product listings, a shopping cart, and a checkout process. Built with React and Node.js."
    }
  ],
  education: {
    degree: "Bachelor of Technology in Computer Science",
    university: "Institute of Technology",
    duration: "2020 - 2024"
  }
}

export function PortfolioGenerator() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline"><Github className="mr-2 h-4 w-4" /> Sync GitHub</Button>
        <Button variant="outline"><Linkedin className="mr-2 h-4 w-4" /> Sync LinkedIn</Button>
        <Button><Download className="mr-2 h-4 w-4" /> Export as PDF</Button>
      </div>
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            <h1 className="text-3xl font-bold">{mockUserData.name}</h1>
            <h2 className="text-lg text-primary">{mockUserData.title}</h2>
            <p className="text-sm text-muted-foreground">{mockUserData.summary}</p>
            
            <Separator />
            
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mockUserData.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-muted text-xs rounded-md">{skill}</span>
              ))}
            </div>
            
            <Separator />

            <h3 className="font-semibold">Education</h3>
            <p className="text-sm font-medium">{mockUserData.education.degree}</p>
            <p className="text-sm text-muted-foreground">{mockUserData.education.university}</p>
            <p className="text-xs text-muted-foreground">{mockUserData.education.duration}</p>
          </div>
          <div className="md:w-2/3 space-y-6">
            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-4">Experience</h3>
              {mockUserData.experience.map(exp => (
                <div key={exp.company}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium">{exp.title}</h4>
                    <span className="text-xs text-muted-foreground">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-primary font-semibold">{exp.company}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-4">Projects</h3>
              {mockUserData.projects.map(proj => (
                <div key={proj.name}>
                  <h4 className="font-medium">{proj.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
