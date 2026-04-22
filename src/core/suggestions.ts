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
    case "label": 
    case "label-title-only":
      return {
        title: "Agregar un label accesible",
        code: `<label for="input-id">Nombre</label>
               <input id="input-id" type="text" />`
      };
    case "form-field-multiple-labels":
      return {
        title: "Evitar múltiples labels para un mismo input",
        code: `<label for="email">Email</label>
               <input id="email" type="email" />`
      };  
    default:
      return {
      title: "No hay sugerencia específica",
      code: "Revisar accesibilidad manualmente según WCAG",
      link: `https://dequeuniversity.com/rules/axe/4.10/${issueId}`
  };
  }
}