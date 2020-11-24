import Positions from '../../Positions'

// A span cannot be created include nonEdgeCharacters only.
export default function (annotationData, spanConfig, selectionWrapper) {
  const positions = new Positions(annotationData, selectionWrapper)

  return spanConfig.removeBlankChractors(positions.selectedString).length > 0
}
