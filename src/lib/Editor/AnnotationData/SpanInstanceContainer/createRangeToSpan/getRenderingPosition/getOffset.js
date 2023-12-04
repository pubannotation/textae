export default function (span, startOfTextNode) {
  const start = span.begin - startOfTextNode
  const end = span.end - startOfTextNode

  return {
    start,
    end
  }
}
