export interface TickerMetric {
  id: string;
  value: string;
  label: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  title: string;
  positioning: string;
  availability: string;
  trustSignal: string;
  location: string;
  email: string;
  calendly: string;
  github: string;
  linkedin: string;
  gravatar: string;
  resumeUrl: string;
  avatarUrl: string;
}

export interface MetricsConfig {
  profile: ProfileData;
  ticker: TickerMetric[];
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  span: "wide" | "narrow";
  monogram: string;
  accentHue: number;
  problem: string;
  outcome: string;
  metrics: ProjectMetric[];
  stack: string[];
  playStoreUrl: string;
  githubUrl: string;
  architectureHighlight: string;
}

export interface TradeoffOption {
  name: string;
  summary: string;
  selected: boolean;
}

export interface TradeoffItem {
  id: string;
  rfcNumber: string;
  topic: string;
  title: string;
  metricImpact: string;
  context: string;
  options: TradeoffOption[];
  decision: string;
  why: string[];
}

export type MilestoneType = "shipped" | "architecture";

export interface ExperienceMilestone {
  type: MilestoneType;
  text: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  summary: string;
  milestones: ExperienceMilestone[];
  stack: string[];
}
