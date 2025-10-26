export default function (annotation) {
  if (annotation.denotations) {
    for (const denotation of annotation.denotations) {
      if (denotation.span.begin !== parseInt(denotation.span.begin, 10)) {
        return true
      }

      if (denotation.span.end !== parseInt(denotation.span.end, 10)) {
        return true
      }
    }
  }
}
