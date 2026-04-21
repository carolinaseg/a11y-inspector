import { useState } from "react";
import axe from "axe-core";
import { A11yIssue } from "../types/types";


export function useA11yAudit() {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const runAudit = async () => {
    setLoading(true);

  await new Promise((r) => setTimeout(r, 500));
  const results = await axe.run(document, {
    runOnly: ["wcag2a", "wcag2aa"]
  });

    const formatted: A11yIssue[] = results.violations.map((v) => ({
      id: v.id,
      description: v.description,
      impact: v.impact ?? null,

      nodes: v.nodes.map((n) => {
        const raw = n.target?.[0];

        const selector =
          typeof raw === "string" ? raw : null;

        const element =
          selector ? document.querySelector(selector) as HTMLElement | null : null;

        return {
          selector,
          html: n.html,
          element: element ?? undefined
        };
      })
    }));

    const newScore = calculateA11yScore(results.violations);

    setIssues(formatted);
    setLastRunAt(new Date());
    setScore(newScore);
    setLoading(false);
  };

  return { issues, runAudit, loading, lastRunAt, score };
}

function calculateA11yScore(violations: any[]) {
  if (!violations.length) return 100;

  const impactWeights: Record<string, number> = {
    critical: 4,
    serious: 3,
    moderate: 2,
    minor: 1
  };

  const total = violations.reduce((acc, v) => {
    return acc + (impactWeights[v.impact] ?? 1) * v.nodes.length;
  }, 0);

  const maxPenalty = 100;
  const score = Math.max(100 - total * 3, 0);

  return Math.round(score);
}