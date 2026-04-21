import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  position: "fixed",
  bottom: 0,
  right: 0,
  width: "340px",
  background: "#111",
  color: "#fff",
  padding: "12px",
  zIndex: 9999,
  maxHeight: "55vh",
  overflow: "auto",
  fontSize: "12px",
  borderTopLeftRadius: "8px",
  transition: "all 0.2s ease"
};

export const buttonStyle: CSSProperties = {
  padding: "6px 10px",
  marginRight: "6px",
  marginTop: "4px",
  cursor: "pointer",
  fontSize: "12px",
};

export const metaStyle: CSSProperties = {
  fontSize: "10px",
  opacity: 0.6,
  marginTop: "4px"
};

export const issueStyle: CSSProperties = {
  borderBottom: "1px solid #333",
  marginBottom: "8px",
  paddingBottom: "6px"
};

export const nodeStyle: CSSProperties = {
  fontSize: "10px",
  opacity: 0.8
};

export const suggestionBoxStyle: CSSProperties = {
  background: "#1a1a1a",
  padding: "8px",
  borderRadius: "6px",
  marginTop: "6px",
  fontSize: "11px"
};

export const aiBoxStyle: CSSProperties = {
  background: "#1a1a1a",
  padding: "8px",
  borderRadius: "6px",
  marginTop: "6px",
  fontSize: "11px"
};

export const codeStyle: CSSProperties = {
  background: "#000",
  padding: "6px",
  borderRadius: "4px",
  overflowX: "auto",
  fontFamily: "monospace",
  whiteSpace: "pre-wrap"
};