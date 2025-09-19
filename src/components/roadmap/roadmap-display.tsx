"use client"

import { useState, useMemo, useEffect } from 'react';
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface RoadmapDisplayProps {
  roadmap: string | null
  isLoading: boolean
}

// A simple parser for Mermaid syntax (graph TD)
function parseMermaid(mermaidText: string): { id: string; label: string }[] {
    if (!mermaidText) return [];
    
    const nodeRegex = /([a-zA-Z0-9_]+)\["([^"]+)"\]/g;
    let match;
    const nodes = [];

    while ((match = nodeRegex.exec(mermaidText)) !== null) {
        nodes.push({ id: match[1], label: match[2] });
    }
    
    // If regex fails, fallback to line-by-line parsing
    if (nodes.length === 0) {
        return mermaidText
            .split(';')
            .map(line => line.trim())
            .filter(line => line.includes('["'))
            .map((line, index) => {
                const idMatch = line.match(/^([a-zA-Z0-9_]+)/);
                const labelMatch = line.match(/\["([^"]+)"\]/);
                return {
                    id: idMatch ? idMatch[1] : `node-${index}`,
                    label: labelMatch ? labelMatch[1] : 'Unnamed Step'
                }
            });
    }

    return nodes;
}


export function RoadmapDisplay({ roadmap, isLoading }: RoadmapDisplayProps) {
  const [mermaidText, setMermaidText] = useState('');
  
  useEffect(() => {
    if (roadmap) {
      // Extract content within ```mermaid ... ``` if present
      const match = roadmap.match(/```mermaid\n([\s\S]*?)\n```/);
      setMermaidText(match ? match[1] : roadmap);
    }
  }, [roadmap]);

  const milestones = useMemo(() => mermaidText ? parseMermaid(mermaidText) : [], [mermaidText]);
  
  if (isLoading) {
    return (
      <CardContent className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
           <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
           <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
        </div>
      </CardContent>
    )
  }

  if (!roadmap) {
    return null
  }

  if (milestones.length === 0) {
    return (
        <CardContent>
            <p className="text-muted-foreground">The generated roadmap could not be displayed as a flowchart. Here is the raw output:</p>
            <pre className="mt-4 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">{roadmap}</pre>
        </CardContent>
    )
  }

  return (
    <CardContent className="space-y-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
        
        <div className="space-y-10">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative pl-10">
              <div className="absolute top-1 left-4 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background"></div>
              <h3 className="text-base font-medium">{milestone.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  )
}
