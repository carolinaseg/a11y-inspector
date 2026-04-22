import { useState, type JSX } from "react";
import { useA11yAudit } from "../../hooks/useA11yAudit";
import type { A11yIssue, AIFixState } from "../../types/types";
import { panelStyle, metaStyle, headerStyle, scoreStyle, issueContainerStyle, panelContentStyle } from "./AccessibilityAssistantPanel.styles";
import { clearHighlights, highlightElements } from "../../core/highlight";
import { fetchAIFix } from "../../api/fetchAIFix";
import { buttonStyle } from "../actionButton/ActionButton.styles";
import IssueCard from "../issueCard/IssueCard";
import ActionButton from "../actionButton/ActionButton";

const AccessibilityAssistantPanel = (): JSX.Element  => {
  const { issues, runAudit, loading, lastRunAt, score } = useA11yAudit();
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [openSuggestionId, setOpenSuggestionId] = useState<string | null>(null);
  const [aiFixes, setAiFixes] = useState<Record<string, AIFixState>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [hasHighlights, setHasHighlights] = useState(false);
  const [hasRunAudit, setHasRunAudit] = useState(false);

  const colorMap: Record<string, string> = {
    critical: "red",
    serious: "orange",
    moderate: "yellow",
    minor: "blue"
  };

  const handleRunAudit = async () => {
    setHasRunAudit(true);
    await new Promise((r) => setTimeout(r, 300));
    runAudit();
  };

  const handleClearHighlights = () => {
    setActiveIssueId(null);
    setHasHighlights(false);
    clearHighlights();
  };

  const handleHighlight = (
    issue: A11yIssue,
    color: string,
    scroll = false,
    focus = false
  ) => {
    const elements = issue.nodes
      .map((n) => n.element)
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    highlightElements(elements, color, {
      scroll,
      focus,
      label: `${issue.id} - ${issue.impact}`
    });
    setHasHighlights(true);
  };

  const handleCopy = (issueId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(issueId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAIFix  = async (nodeHtml: string | null, issue: A11yIssue) => {
    if (!nodeHtml) return;
    setAiFixes((prev) => ({
      ...prev,
      [issue.id]: { status: "loading" }
    }));
    try {
      const result = await fetchAIFix(issue.id, nodeHtml);
      setAiFixes((prev) => ({
        ...prev,
        [issue.id]: {
          status: "success",
          explanation: result.explanation,
          fixedCode: result.fixedCode
        }
      }));
    } catch {
      setAiFixes((prev) => ({
        ...prev,
        [issue.id]: {
          status: "error",
          message: "Error al generar fix"
        }
      }));
    }
  }

  return (
    <div style={panelStyle}>
      {/* HEADER */}
      <div style={headerStyle} onClick={() => setIsOpen((v) => !v)} >
        <h3 style={{ margin: 0 }}>Accessibility Assistant</h3>
        {score !== null && (
          <span
            style={{
              ... scoreStyle, background:
              score >= 90 ? "#1f7a1f" :
              score >= 70 ? "#b38b00" :
              "#7a1f1f"
            }}
          >
            Score: {score}
          </span>
        )}
        <button style={buttonStyle}>
          {isOpen ? "—" : "+"}
        </button>
      </div>

      {/* PANEL CONTENT */}
      {isOpen && (
        <div style={panelContentStyle}>
          <ActionButton onClick={handleRunAudit}>
            {loading ? "Analizando..." : lastRunAt ? "Re-analizar" : "Analizar"}
          </ActionButton>
          {hasHighlights && (
            <ActionButton onClick={handleClearHighlights}>
              Limpiar resaltado
            </ActionButton>
          )}
          {lastRunAt && (
            <p style={metaStyle}>
              Último análisis: {lastRunAt.toLocaleTimeString()}
            </p>
          )}
          {!loading && hasRunAudit && issues.length === 0 && (
            <p style={{ opacity: 0.6 }}>Sin problemas detectados</p>
          )}
          <div style={issueContainerStyle}>
            {issues.map((issue) => {
              const color = colorMap[issue.impact ?? "minor"];
              const isActive = activeIssueId === issue.id;
              const ai = aiFixes[issue.id];
              const fixedCode = ai?.status === "success" ? ai.fixedCode : undefined;

              return (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  color={color}
                  isActive={isActive}
                  isSuggestionOpen={openSuggestionId === issue.id}
                  onHighlight={() => {
                    setActiveIssueId(issue.id);
                    clearHighlights();
                    handleHighlight(issue, color, true, true);
                  }}
                  onToggleSuggestion={() =>
                    setOpenSuggestionId(
                      openSuggestionId === issue.id ? null : issue.id
                    )
                  }
                  onAIFix={() => handleAIFix(issue.id, issue)}
                  ai={ai}
                  copied={copiedId === issue.id}
                  onCopy={() => fixedCode && handleCopy(issue.id, fixedCode)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityAssistantPanel;