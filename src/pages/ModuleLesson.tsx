import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const moduleLessons: { [key: string]: { title: string; content: string; lessons: { title: string; text: string }[] } } = {
  "effective-listening": {
    title: "Module 1: Effective Listening",
    content: "Learn the art of active listening to improve understanding and build stronger relationships.",
    lessons: [
      { title: "Lesson 1.1: The Power of Presence", text: "Focus entirely on the speaker, putting away distractions. Show you're engaged through eye contact and body language." },
      { title: "Lesson 1.2: Paraphrasing and Summarizing", text: "Repeat back what you've heard in your own words to confirm understanding and show you're listening." },
      { title: "Lesson 1.3: Asking Clarifying Questions", text: "Ask open-ended questions to delve deeper and gain more context, avoiding assumptions." },
      { title: "Lesson 1.4: Avoiding Interruptions", text: "Allow the speaker to complete their thoughts without cutting them off. Practice patience and wait for natural pauses." },
    ],
  },
  "constructive-feedback": {
    title: "Module 2: Giving Constructive Feedback",
    content: "Master the skill of providing feedback that is both honest and helpful.",
    lessons: [
      { title: "Lesson 2.1: Focus on Behavior, Not Person", text: "Describe specific actions rather than making judgments about character. E.g., 'When you did X' instead of 'You are Y'." },
      { title: "Lesson 2.2: Impact and Consequences", text: "Explain the effect of their behavior on you, the team, or the project. This helps them understand the 'why'." },
      { title: "Lesson 2.3: Future-Oriented Solutions", text: "Collaborate on solutions and suggest ways to improve or change behavior going forward." },
      { title: "Lesson 2.4: Timeliness and Privacy", text: "Deliver feedback promptly after the event, and always in a private setting to avoid embarrassment." },
    ],
  },
  "conflict-resolution": {
    title: "Module 3: Conflict Resolution",
    content: "Strategies for navigating disagreements and finding mutually beneficial outcomes.",
    lessons: [
      { title: "Lesson 3.1: Identify the Core Issue", text: "Move beyond surface-level arguments to understand the underlying needs and interests of all parties." },
      { title: "Lesson 3.2: Active Listening in Conflict", text: "Give each person a chance to speak without interruption, validating their feelings and perspectives." },
      { title: "Lesson 3.3: Brainstorming Solutions", text: "Encourage creative thinking to find multiple options that could satisfy everyone's needs." },
      { title: "Lesson 3.4: Reaching Agreement", text: "Facilitate a discussion to choose the best solution and ensure all parties commit to it." },
    ],
  },
  "motivational-leadership": {
    title: "Module 4: Motivational Leadership",
    content: "Inspire and empower your team through positive reinforcement, clear vision, and leading by example.",
    lessons: [
      { title: "Lesson 4.1: Understanding Motivators", text: "Recognize that different team members are driven by different factors (e.g., recognition, growth, autonomy)." },
      { title: "Lesson 4.2: Setting Clear Vision and Goals", text: "Communicate a compelling vision and ensure individual goals align with team and organizational objectives." },
      { title: "Lesson 4.3: Empowering Autonomy", text: "Delegate responsibility and trust team members to make decisions, fostering ownership and engagement." },
      { title: "Lesson 4.4: Providing Recognition and Rewards", text: "Acknowledge and celebrate achievements, both big and small, to reinforce positive behaviors and boost morale." },
    ],
  },
};

const ModuleLesson = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = moduleId ? moduleLessons[moduleId] : undefined;

  if (!module) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Module Not Found</h2>
        <p className="text-muted-foreground">The leadership module you are looking for does not exist.</p>
        <Link to="/leadership-modules">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
          </Button>
        </Link>
      </div>
    );
  );
  }

  return (
    <div className="space-y-8">
      <Link to="/leadership-modules">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
        </Button>
      </Link>
      <h2 className="text-3xl font-bold">{module.title}</h2>
      <p className="text-muted-foreground">{module.content}</p>

      <div className="grid gap-6">
        {module.lessons.map((lesson, index) => (
          <Card key={index} className="bg-secondary text-secondary-foreground border-border">
            <CardHeader>
              <CardTitle className="text-xl">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{lesson.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModuleLesson;