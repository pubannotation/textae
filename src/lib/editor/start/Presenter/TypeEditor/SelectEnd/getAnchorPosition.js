import getPosition from './getPosition'

export default function(annotationData, selection) {
  const position = getPosition(
    annotationData.paragraph,
    annotationData.span,
    selection.anchorNode
  )
  return position + selection.anchorOffset
}
