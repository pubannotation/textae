export default function(span, emitter) {
  return `span ${span.begin}:${span.end}:${emitter.sourceDoc.substring(span.begin, span.end)}`
}
