export default function(denotation, paragraph) {
  return (
    paragraph.all.filter(
      (p) => p.begin <= denotation.span.begin && denotation.span.end <= p.end
    ).length === 1
  )
}
