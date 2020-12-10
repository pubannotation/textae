import OrderedPositions from './OrderedPositions'
import PositionsOnAnnotation from './PositionsOnAnnotation'

// A span cannot be created include nonEdgeCharacters only.
export default function (annotationData, spanConfig, selectionWrapper) {
  const positionsOnAnnotation = new PositionsOnAnnotation(
    annotationData.span,
    selectionWrapper
  )
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)
  const selectedString = annotationData.sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankChractors(selectedString).length > 0
}
