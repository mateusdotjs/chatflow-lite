export function extractDomain(url: string): string | null {
  // Regex para capturar o domínio completo, incluindo a porta, se houver
  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?([^\/\n]+)/i;
  const matches = url.match(domainRegex);

  return matches ? matches[1] : null;
}