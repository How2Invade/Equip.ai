import { ChatInterface } from "@/components/counselor/chat-interface";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CounselorPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>AI Career Counselor</CardTitle>
                <CardDescription>Ask me anything about your career path, skills, or job market trends.</CardDescription>
            </CardHeader>
            <ChatInterface />
        </Card>
    </div>
  );
}
