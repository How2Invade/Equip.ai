"use client"

import { useState, useMemo } from 'react';
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface RoadmapDisplayProps {
  roadmap: string | null
  isLoading: boolean
}

type Milestone = {
  id: string;
  title: string;
  items: { id: string; text: string }[];
};

function parseRoadmap(roadmapText: string): Milestone[] {
    if (!roadmapText) return [];

    const sections = roadmapText.split(/\n(?=##\s)/).map(section => section.trim());
    
    return sections.map((section, index) => {
        const lines = section.split('\n');
        const title = lines[0].replace(/^##\s*/, '').trim();
        const items = lines.slice(1).map(line => line.trim().replace(/^- \s*/, '')).filter(Boolean);

        return {
            id: `milestone-${index}`,
            title,
            items: items.map((item, itemIndex) => ({
                id: `milestone-${index}-item-${itemIndex}`,
                text: item,
            })),
        };
    }).filter(milestone => milestone.title && milestone.items.length > 0);
}

export function RoadmapDisplay({ roadmap, isLoading }: RoadmapDisplayProps) {
  const milestones = useMemo(() => roadmap ? parseRoadmap(roadmap) : [], [roadmap]);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const totalItems = useMemo(() => milestones.reduce((acc, m) => acc + m.items.length, 0), [milestones]);
  const progress = totalItems > 0 ? (completedItems.size / totalItems) * 100 : 0;
  
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };
  
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
            <p className="text-muted-foreground">The generated roadmap could not be displayed. It might be in an unrecognized format.</p>
            <pre className="mt-4 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">{roadmap}</pre>
        </CardContent>
    )
  }

  return (
    <CardContent className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Overall Progress</h4>
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
        
        <div className="space-y-10">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative pl-10">
              <div className="absolute top-1 left-4 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background"></div>
              <h3 className="text-lg font-semibold mb-3">{index + 1}. {milestone.title}</h3>
              <div className="space-y-3">
                {milestone.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={completedItems.has(item.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  )
}
