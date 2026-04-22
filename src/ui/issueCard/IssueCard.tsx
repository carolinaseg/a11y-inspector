import type { JSX } from "react";
import type { A11yIssue, AIFixState } from "../../types/types";
import { getSuggestion } from "../../core/suggestions";
import { aiBoxStyle, codeStyle, nodeStyle } from "../..";
import ActionButton from "../actionButton/ActionButton";
import { issueStyle, suggestionBoxStyle } from "./IssueCard.styles";

type Props = {
  issue: A11yIssue;
  color: string;
  isActive: boolean;
  onHighlight: () => void;
  onToggleSuggestion: () => void;
  isSuggestionOpen: boolean;
  onAIFix: () => void;
  ai: AIFixState | undefined;
  copied: boolean;
  onCopy: () => void;
};

export default function IssueCard({
  issue,
  isActive,
  onHighlight,
  onToggleSuggestion,
  isSuggestionOpen,
  onAIFix,
  ai,
  copied,
  onCopy
}: Props): JSX.Element {
  const nodeHtml = issue.nodes[0]?.html;
  const suggestion = getSuggestion(issue.id, nodeHtml);

  return (
    <div style={issueStyle}>
      <strong>{issue.id}</strong>
      <p>{issue.description}</p>
      <small>Impacto: {issue.impact ?? "N/A"}</small>

      <ActionButton active={isActive} onClick={onHighlight}>
        Ver en pantalla
      </ActionButton>

      <ActionButton onClick={onToggleSuggestion}>
        Ver solución
      </ActionButton>

      {isSuggestionOpen && (
        <div style={suggestionBoxStyle}>
          <p>{suggestion?.title}</p>
          <pre style={codeStyle}>{suggestion?.code}</pre>
        </div>
      )}

      {suggestion?.link && (
        <a
          href={suggestion.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "12px", color: "#4ea1ff" }}
        >
          Ver documentación
        </a>
      )}

      <ActionButton onClick={onAIFix}>
        {ai?.status === "loading" ? "Generando..." : "IA Fix"}
      </ActionButton>

      {ai?.status === "success" && ai.fixedCode?.trim() && (
        <ActionButton
          variant={copied ? "success" : "default"}
          onClick={onCopy}
        >
          {copied ? "Copiado ✔" : "Copiar código"}
        </ActionButton>
      )}

      {ai?.status === "success" && (
        <div style={aiBoxStyle}>
          <p>{ai.explanation}</p>
          <pre style={codeStyle}>{ai.fixedCode}</pre>
        </div>
      )}

      {ai?.status === "error" && (
        <p style={{ color: "red" }}>{ai.message}</p>
      )}

      <div style={{ marginTop: 6 }}>
        {issue.nodes.map((node, i) => (
          <div key={i} style={nodeStyle}>
            <code>{node.selector ?? "no selector disponible"}</code>
          </div>
        ))}
      </div>
    </div>
  );
}