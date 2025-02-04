export default function escapeHTML(str) {
  return str
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
}
