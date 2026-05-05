export type A11yNode = {
  selector: string | null;
  html: string;
  element?: HTMLElement;
};

export type NormalizedA11yNode = {
  selector: string | null;
  html: string;
  element?: HTMLElement;
};

export type A11yIssue = {
  id: string;
  description: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  nodes: A11yNode[];
};

export type HighlightOptions = {
  scroll?: boolean;
  focus?: boolean;
};

export type Suggestion = {
  title: string;
  code: string;
  link?: string;
};

export type AIFixState =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "success";
      explanation: string;
      fixedCode: string;
    }
  | {
      status: "error";
      message: string;
    };

export type Breakdown = {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
};