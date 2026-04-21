import { Suggestion } from "../types/types";



export function getSuggestion(
  issueId: string,
  nodeHtml?: string
): Suggestion | null {
  switch (issueId) {
    case "image-alt":
      return {
        title: "Agregar atributo alt",
        code: nodeHtml
          ? nodeHtml.replace(
              "<img",
              '<img alt="Descripción de la imagen"'
            )
          : `<img src="..." alt="Descripción de la imagen" />`
      };

    case "button-name":
      return {
        title: "Agregar texto o aria-label",
        code: nodeHtml
          ? nodeHtml.includes(">")
            ? nodeHtml.replace(
                ">",
                ' aria-label="Acción">'
              )
            : `<button aria-label="Acción">...</button>`
          : `<button aria-label="Acción">...</button>`
      };

    case "link-name":
      return {
        title: "Agregar texto accesible al link",
        code: nodeHtml
          ? nodeHtml.replace(
              "></a>",
              ">Texto del enlace</a>"
            )
          : `<a href="/ruta">Texto del enlace</a>`
      };

    case "color-contrast":
      return {
        title: "Mejorar contraste",
        code: `.button {
            background-color: #000;
            color: #fff;
            }`
      };

    default:
      return null;
  }
}