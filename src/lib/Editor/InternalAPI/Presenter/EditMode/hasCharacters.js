import OrderedPositions from './OrderedPositions'

// A span cannot be created include nonEdgeCharacters only.
export default function (sourceDoc, spanConfig, selectionWrapper) {
  const { positionsOnAnnotation } = selectionWrapper
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)
  const selectedString = sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankChractors(selectedString).length > 0
}
