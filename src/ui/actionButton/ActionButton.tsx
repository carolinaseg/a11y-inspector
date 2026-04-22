import { buttonStyle } from "./ActionButton.styles";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "success";
};

export default function ActionButton({
  children,
  onClick,
  active = false,
  disabled = false,
  variant = "default"
}: Props) {
  const variantStyles =
    variant === "success"
      ? { backgroundColor: "#1f7a1f", color: "#fff" }
      : { backgroundColor: active ? "#3a3a3a" : "transparent", color: "#fff" };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...buttonStyle,
        ...variantStyles,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease"
      }}
    >
      {children}
    </button>
  );
}