import { useState } from "react";
import { A11yIssue, Breakdown } from "../types/types";
import { runA11yEngine } from "../core/engine";


export function useA11yAudit() {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);

  const runAudit = async () => {
    setLoading(true);

    const result = await runA11yEngine();

    setIssues(result.issues);
    setScore(result.score);
    setLastRunAt(new Date());
    setBreakdown(result.breakdown);

    setLoading(false);
  };

  return {
    issues,
    runAudit,
    loading,
    lastRunAt,
    score,
    breakdown
  };
}