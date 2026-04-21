const HIGHLIGHT_ATTR = "data-eleazar-highlight";
const TOOLTIP_ATTR = "data-eleazar-tooltip";

type HighlightOptions = {
  scroll?: boolean;
  focus?: boolean;
  label?: string;
};

export function highlightElements(
  elements: HTMLElement[],
  color: string = "red",
  options: HighlightOptions = {}
) {
  const { scroll = false, focus = false, label } = options;

  let firstElement: HTMLElement | null = null;

  elements.forEach((selector) => {
    try {

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;

        if (!(el instanceof HTMLElement)) return;

        // highlight
        htmlEl.style.outline = `2px solid ${color}`;
        htmlEl.style.outlineOffset = "2px";
        htmlEl.setAttribute(HIGHLIGHT_ATTR, "true");

        // tooltip
        if (label) {
          createTooltip(htmlEl, label);
        }
      });
    } catch {
      console.warn("Selector inválido:", selector);
    }
  });

  if (firstElement && scroll) {
    (firstElement as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    if (focus) {
      if (!(firstElement as HTMLElement).hasAttribute("tabindex")) {
        (firstElement as HTMLElement).setAttribute("tabindex", "-1");
      }

      setTimeout(() => {
        (firstElement as HTMLElement)?.focus({ preventScroll: true });
      }, 300);
    }
  }
}

function createTooltip(target: HTMLElement, text: string) {
  const rect = target.getBoundingClientRect();

  const tooltip = document.createElement("div");
  tooltip.innerText = text;

  tooltip.style.position = "fixed";
  tooltip.style.top = `${rect.top - 30}px`;
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.background = "#111";
  tooltip.style.color = "#fff";
  tooltip.style.padding = "4px 8px";
  tooltip.style.fontSize = "10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.zIndex = "10000";
  tooltip.style.pointerEvents = "none";
  tooltip.style.maxWidth = "200px";

  tooltip.setAttribute(TOOLTIP_ATTR, "true");

  document.body.appendChild(tooltip);
}

export function clearHighlights() {
  // limpiar outlines
  const elements = document.querySelectorAll(`[${HIGHLIGHT_ATTR}]`);
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.outline = "";
    htmlEl.style.outlineOffset = "";
    htmlEl.removeAttribute(HIGHLIGHT_ATTR);
  });

  // limpiar tooltips
  const tooltips = document.querySelectorAll(`[${TOOLTIP_ATTR}]`);
  tooltips.forEach((el) => el.remove());
}