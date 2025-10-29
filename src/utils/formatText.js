// Helper function to parse simple markdown-style formatting
export function parseFormatting(text) {
  if (!text) return text;

  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}
