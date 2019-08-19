import getPosition from './getPosition'

export default function(annotationData, selection) {
  const position = getPosition(
    annotationData.paragraph,
    annotationData.span,
    selection.focusNode
  )
  return position + selection.focusOffset
}
