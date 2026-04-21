export async function fetchAIFix(issueId: string, html: string) {
  const res = await fetch("http://localhost:3001/api/ai-fix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ issueId, html })
  });

  if (!res.ok) {
    throw new Error("Error al obtener fix de IA");
  }

  return res.json();
}