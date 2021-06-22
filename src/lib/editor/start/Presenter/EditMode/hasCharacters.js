import OrderedPositions from './OrderedPositions'

// A span cannot be created include nonEdgeCharacters only.
export default function (annotationData, spanConfig, selectionWrapper) {
  const positionsOnAnnotation = selectionWrapper.getPositionsOnAnnotation(
    annotationData.span
  )
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)
  const selectedString = annotationData.sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankChractors(selectedString).length > 0
}
