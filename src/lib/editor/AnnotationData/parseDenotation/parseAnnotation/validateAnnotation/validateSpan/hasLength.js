export default function (annotation) {
  return annotation.span.end - annotation.span.begin > 0
}
