import OrderedPositions from './OrderedPositions'
import Positions from './Positions'

// A span cannot be created include nonEdgeCharacters only.
export default function (annotationData, spanConfig, selectionWrapper) {
  const positions = new Positions(annotationData, selectionWrapper)
  const orderedPositions = new OrderedPositions(positions)
  const selectedString = annotationData.sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankChractors(selectedString).length > 0
}
