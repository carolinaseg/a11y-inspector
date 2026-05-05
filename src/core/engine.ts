import axe from "axe-core";
import type { A11yIssue } from "../types/types";

export type A11yEngineResult = {
  issues: A11yIssue[];
  score: number;
  breakdown: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
};

type Impact = "critical" | "serious" | "moderate" | "minor";

const impactWeights: Record<Impact, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1
};

export function calculateScore(issues: A11yIssue[]): number {
  let totalWeight = 0;

  issues.forEach((issue) => {
    const impact = (issue.impact ?? "minor") as Impact;
    totalWeight += impactWeights[impact];
  });

  const penalty = totalWeight * 2;

  return Math.max(0, 100 - penalty);
}

export function getImpactBreakdown(issues: A11yIssue[]) {
  return {
    critical: issues.filter(i => i.impact === "critical").length,
    serious: issues.filter(i => i.impact === "serious").length,
    moderate: issues.filter(i => i.impact === "moderate").length,
    minor: issues.filter(i => i.impact === "minor").length
  };
}

function normalizeSelector(target: unknown): string | null {
  if (!target) return null;

  if (typeof target === "string") return target;

  if (Array.isArray(target)) {
    const first = target[0];
    return typeof first === "string" ? first : null;
  }

  return null;
}

function mapIssues(violations: axe.Result[]): A11yIssue[] {
  return violations.map((v) => ({
    id: v.id,
    description: v.description,
    impact: v.impact ?? null,
    nodes: v.nodes.map((n) => {
      const selector = normalizeSelector(n.target);

      return {
        selector,
        html: n.html,
        element: selector
          ? (document.querySelector(selector) as HTMLElement | null) ?? undefined
          : undefined
      };
    })
  }));
}

export async function runA11yEngine(): Promise<A11yEngineResult> {
  const results = await axe.run(document, {
    runOnly: ["wcag2a", "wcag2aa"]
  });

  const issues = mapIssues(results.violations);

  const score = calculateScore(issues);
  const breakdown = getImpactBreakdown(issues);

  return {
    issues,
    score,
    breakdown
  };
}