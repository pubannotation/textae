export default function (span, position) {
  if (!span) {
    return false
  }

  return span.begin < position && position < span.end
}
