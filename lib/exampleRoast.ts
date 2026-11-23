import type { RoastResult } from "@/types/roast";

export const exampleRoast: RoastResult = {
  overallScore: 68,
  summary: "Your resume has solid experience, but it is currently whispering its achievements from inside a spreadsheet.",
  categoryScores: {
    content: 72,
    impact: 58,
    clarity: 76,
    ats: 70,
    structure: 74,
    skills: 65,
    professionalism: 79,
  },
  topIssues: [
    {
      title: "Bullet points describe duties instead of results",
      category: "Impact",
      severity: "high",
      roast: "You did the work. Your bullets just forgot to tell anyone why it mattered.",
      explanation: "Several bullets list responsibilities without showing outcomes, scale, or measurable results.",
      recommendation: "Add numbers, scope, and business outcomes to your strongest accomplishments.",
    },
    {
      title: "Skills section is playing it safe",
      category: "Skills",
      severity: "medium",
      roast: "Listing Microsoft Word as a skill is technically honest, but so is listing breathing.",
      explanation: "The skills section prioritizes common tools and does not clearly show role-specific strengths.",
      recommendation: "Lead with the tools, methods, and domain skills most relevant to your target role.",
    },
    {
      title: "Opening summary is too general",
      category: "Content",
      severity: "medium",
      roast: "It says you are motivated, which is wonderful. So is every person who has ever opened a job board.",
      explanation: "The summary does not establish a specific professional focus or distinctive value.",
      recommendation: "Name your specialty, years of experience, and the outcomes you consistently deliver.",
    },
  ],
  bulletRoasts: [
    {
      original: "Responsible for managing projects and working with the team.",
      roast: "A sentence assembled entirely from job-description wallpaper.",
      improved: "Led 4 cross-functional projects from kickoff to launch, delivering 2 weeks ahead of schedule.",
      reason: "Shows ownership, scope, collaboration, and a measurable result.",
    },
    {
      original: "Helped improve customer satisfaction.",
      roast: "'Helped' is doing heroic amounts of hiding here.",
      improved: "Redesigned the support workflow, cutting average response time by 35% and raising CSAT to 94%.",
      reason: "Replaces vague contribution with an action, method, and quantified outcome.",
    },
  ],
  quickWins: [
    "Replace duty-led bullets with achievement-led statements.",
    "Add metrics to at least three recent accomplishments.",
    "Rewrite the summary around one clear target role.",
    "Move the most relevant technical skills to the front of the skills section.",
  ],
  finalVerdict: "The raw material is here. Give your achievements numbers, give your summary a point of view, and this resume will stop blending into the applicant-tracking-system wallpaper.",
};
