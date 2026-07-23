import { lazy } from 'react';

export interface InteractiveTool {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: string;
  route: string;
  featured?: boolean;
  popular?: boolean;
  recentlyUpdated?: boolean;
  tags: string[];
  badge?: string;
}

// The 5 active Tech Toolkit tools
export const INTERACTIVE_TOOLS: InteractiveTool[] = [
  {
    id: 'product-comparison',
    name: 'Smart Product Comparison',
    desc: 'Compare tech products side-by-side with specs, ratings, and AI-powered smart recommendations.',
    icon: '⚖️',
    category: '💻 Tech Buying',
    route: '/resources/product-comparison',
    featured: true,
    popular: true,
    recentlyUpdated: true,
    tags: ['comparison', 'buying', 'tech', 'products'],
    badge: 'Most Popular',
  },
  {
    id: 'cgpa-calculator',
    name: 'Advanced CGPA Calculator',
    desc: 'Calculate semester GPA, track cumulative CGPA, and visualize your academic progress over time.',
    icon: '🎓',
    category: '🎓 Student Tools',
    route: '/resources/cgpa-calculator',
    featured: true,
    popular: true,
    tags: ['study', 'grades', 'CGPA', 'GPA', 'academic'],
    badge: 'Student Favourite',
  },
  {
    id: 'study-planner',
    name: 'Advanced Study Planner',
    desc: 'Plan your study sessions by subject, set daily goals, track progress, and stay on top of your schedule.',
    icon: '📚',
    category: '🎓 Student Tools',
    route: '/resources/study-planner',
    featured: true,
    recentlyUpdated: true,
    tags: ['study', 'schedule', 'planner', 'productivity'],
  },
  {
    id: 'emi-calculator',
    name: 'Advanced EMI Calculator',
    desc: 'Calculate monthly EMI, total interest, amortization schedule, and break-even analysis for any loan.',
    icon: '💰',
    category: '📊 Calculators',
    route: '/resources/emi-calculator',
    featured: true,
    recentlyUpdated: true,
    tags: ['finance', 'budget', 'loan', 'EMI', 'interest'],
  },
  {
    id: 'goal-planner',
    name: 'Advanced Goal Planner',
    desc: 'Break down big goals into milestones, track daily habits, and visualize your progress toward success.',
    icon: '🎯',
    category: '📊 Productivity',
    route: '/resources/goal-planner',
    popular: true,
    tags: ['planning', 'goals', 'productivity', 'habits'],
  },
];

// Coming-soon placeholders (previously built + AI tools)
export const PLACEHOLDER_TOOLS = [
  { id: 'pomodoro', name: 'Focus Timer', desc: 'Pomodoro timer with work/break intervals and session tracking.', icon: '⏱️', tags: ['productivity', 'focus', 'study'] },
  { id: 'pc-builder', name: 'PC Builder', desc: 'Build your ideal PC within a budget. Real-time price estimates.', icon: '🖥️', tags: ['PC', 'gaming', 'budget'] },
  { id: 'text-analyzer', name: 'Text Analyzer', desc: 'Word count, reading time, readability score, and keyword density.', icon: '📝', tags: ['writing', 'editing'] },
  { id: 'markdown', name: 'Notes Editor', desc: 'Write in Markdown with live preview. Export plain text.', icon: '📄', tags: ['writing', 'notes'] },
  { id: 'colors', name: 'Color Palette', desc: 'Generate harmonious palettes, extract hex codes, preview on UI.', icon: '🎨', tags: ['design', 'colors', 'UI'] },
  { id: 'unit-converter', name: 'Unit Converter', desc: 'Convert storage units, resolution specs, and data rates.', icon: '📐', tags: ['conversion', 'tech'] },
  { id: 'password-gen', name: 'Password Generator', desc: 'Generate strong passwords with customizable settings.', icon: '🔐', tags: ['security', 'utility'] },
  { id: 'ai-writing', name: 'AI Writing Assistant', desc: 'Generate blog posts, essays, and content with AI.', icon: '✍️', tags: ['writing', 'AI'] },
  { id: 'ai-study', name: 'AI Study Buddy', desc: 'Upload notes, get quizzes and summaries powered by AI.', icon: '🤖', tags: ['study', 'AI'] },
  { id: 'ai-code', name: 'AI Code Reviewer', desc: 'Paste code and get instant review feedback from AI.', icon: '💻', tags: ['code', 'AI'] },
];

export const TOOL_CATEGORIES = ['All', '💻 Tech Buying', '🎓 Student Tools', '📊 Calculators', '📊 Productivity'] as const;

export const FEATURED_TOOLS = INTERACTIVE_TOOLS.filter(t => t.featured);
export const POPULAR_TOOLS = INTERACTIVE_TOOLS.filter(t => t.popular);
export const RECENTLY_UPDATED_TOOLS = INTERACTIVE_TOOLS.filter(t => t.recentlyUpdated);
