import axe from "axe-core";
import type { A11yIssue } from "../types/types";

export type A11yEngineResult = {
  issues: A11yIssue[];
  score: number;
};

function calculateA11yScore(violations: axe.Result[]) {
  if (!violations.length) return 100;

  const impactWeights: Record<string, number> = {
    critical: 4,
    serious: 3,
    moderate: 2,
    minor: 1
  };

  const totalPenalty = violations.reduce((acc, v) => {
    return acc + (impactWeights[v.impact ?? "minor"] ?? 1) * v.nodes.length;
  }, 0);

  const score = Math.max(100 - totalPenalty * 3, 0);

  return Math.round(score);
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
  const score = calculateA11yScore(results.violations);

  return {
    issues,
    score
  };
}

function normalizeSelector(target: unknown): string | null {
  if (!target) return null;

  // caso string directo
  if (typeof target === "string") return target;

  // caso array (lo más común en axe)
  if (Array.isArray(target)) {
    const first = target[0];
    return typeof first === "string" ? first : null;
  }

  // cualquier otro caso (shadow dom complejo, etc.)
  return null;
}