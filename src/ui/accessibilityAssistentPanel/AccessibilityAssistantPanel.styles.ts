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

export const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer"
}

export const scoreStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "12px"
}

export const issueContainerStyle: CSSProperties = {
  marginTop: "10px",
};

export const panelContentStyle: CSSProperties = {
  marginTop: "10px",
};

export const metaStyle: CSSProperties = {
  fontSize: "10px",
  opacity: 0.6,
  marginTop: "4px"
};

export const nodeStyle: CSSProperties = {
  fontSize: "10px",
  opacity: 0.8
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