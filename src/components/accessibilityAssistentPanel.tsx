import { useState, type JSX } from "react";
import { useA11yAudit } from "../hooks/useA11yAudit";
import type { A11yIssue, AIFixState } from "../types/types";

import {
  panelStyle,
  buttonStyle,
  metaStyle,
  issueStyle,
  nodeStyle,
  suggestionBoxStyle,
  aiBoxStyle,
  codeStyle
} from "./AccessibilityAssistantPanel.styles";

import { clearHighlights, highlightElements } from "../core/highlight";
import { getSuggestion } from "../core/suggestions";
import { fetchAIFix } from "../api/fetchAIFix";

export default function AccessibilityAssistantPanel(): JSX.Element {
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

    console.log("BUTTONS EN DOM:", document.querySelectorAll("button"));

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

  return (
    <div style={panelStyle}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => setIsOpen((v) => !v)}
      >
        <h3 style={{ margin: 0 }}>Accessibility Assistant</h3>
        {score !== null && (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background:
                score >= 90 ? "#1f7a1f" :
                score >= 70 ? "#b38b00" :
                "#7a1f1f",
              color: "#fff",
              fontSize: "12px"
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
        <div style={{ marginTop: 10 }}>
          {/* toolbar */}
          <button onClick={handleRunAudit} style={buttonStyle}>
            {loading ? "Analizando..." : lastRunAt ? "Re-analizar" : "Analizar"}
          </button>

          {hasHighlights && (
            <button onClick={handleClearHighlights} style={buttonStyle}>
              Limpiar resaltado
            </button>
          )}

          {lastRunAt && (
            <p style={metaStyle}>
              Último análisis: {lastRunAt.toLocaleTimeString()}
            </p>
          )}

          {/* empty state */}
          {!loading && hasRunAudit && issues.length === 0 && (
            <p style={{ opacity: 0.6 }}>Sin problemas detectados</p>
          )}

          {/* issues */}
          <div style={{ marginTop: 10 }}>
            {issues.map((issue) => {
              const color = colorMap[issue.impact ?? "minor"];
              const nodeHtml = issue.nodes[0]?.html;
              const isActive = activeIssueId === issue.id;

              const ai = aiFixes[issue.id];

              return (
                <div key={issue.id} style={issueStyle}>
                  <strong>{issue.id}</strong>
                  <p>{issue.description}</p>
                  <small>Impacto: {issue.impact ?? "N/A"}</small>

                  {/* highlight */}
                  <button
                    style={{
                      ...buttonStyle,
                      marginTop: 6,
                      backgroundColor: isActive ? "#3a3a3a" : "transparent",
                      color: "#fff"
                    }}
                    onClick={() => {
                      setActiveIssueId(issue.id);
                      clearHighlights();
                      handleHighlight(issue, color, true, true);
                    }}
                  >
                    Ver en pantalla
                  </button>

                  {/* suggestion */}
                  <button
                    style={buttonStyle}
                    onClick={() =>
                      setOpenSuggestionId(
                        openSuggestionId === issue.id ? null : issue.id
                      )
                    }
                  >
                    Ver solución
                  </button>

                  {openSuggestionId === issue.id && (
                    <div style={suggestionBoxStyle}>
                      <p>{getSuggestion(issue.id, nodeHtml)?.title}</p>
                      <pre style={codeStyle}>
                        {getSuggestion(issue.id, nodeHtml)?.code}
                      </pre>
                    </div>
                  )}

                  {/* IA FIX */}
                  <button
                    style={{backgroundColor: isActive ? "#3a3a3a" : "transparent",
                      color: "#fff"}}
                    onClick={async () => {
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
                    }}
                  >
                    {ai?.status === "loading" ? "Generando..." : "IA Fix"}
                  </button>

                  {/* copy button */}
                  {ai?.status === "success" && ai.fixedCode?.trim() && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(ai.fixedCode);
                        setCopiedId(issue.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      style={{
                        ...buttonStyle,
                        backgroundColor:
                          copiedId === issue.id ? "#1f7a1f" : undefined,
                        transition: "all 0.2s ease"
                      }}
                    >
                      {copiedId === issue.id ? "Copiado ✔" : "Copiar código"}
                    </button>
                  )}

                  {/* AI result */}
                  {ai?.status === "success" && (
                    <div style={aiBoxStyle}>
                      <p style={{ marginBottom: 6 }}>{ai.explanation}</p>
                      <pre style={codeStyle}>{ai.fixedCode}</pre>
                    </div>
                  )}

                  {/* error */}
                  {ai?.status === "error" && (
                    <p style={{ color: "red" }}>{ai.message}</p>
                  )}

                  {/* nodes */}
                  <div style={{ marginTop: 6 }}>
                    {issue.nodes.map((node, i) => (
                      <div key={i} style={nodeStyle}>
                        <code>
                          {node.selector ?? "no selector disponible"}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}