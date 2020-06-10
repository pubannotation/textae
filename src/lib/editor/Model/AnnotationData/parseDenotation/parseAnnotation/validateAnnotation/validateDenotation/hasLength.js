export default function(denotation) {
  return denotation.span.end - denotation.span.begin > 0
}
