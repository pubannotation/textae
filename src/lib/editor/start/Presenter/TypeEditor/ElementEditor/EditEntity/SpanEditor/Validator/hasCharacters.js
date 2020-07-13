import Positions from '../Positions'

// A span cannot be created include nonEdgeCharacters only.
export default function(annotationData, spanConfig, selectionWrapper) {
  const selection = selectionWrapper.selection
  const positions = new Positions(annotationData, selection)

  return spanConfig.removeBlankChractors(positions.selectedString).length > 0
}
