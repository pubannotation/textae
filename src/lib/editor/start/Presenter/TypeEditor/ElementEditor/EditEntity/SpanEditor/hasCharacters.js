import Positions from './Positions'

// A span cannot be created include nonEdgeCharacters only.
export default function(annotationData, spanConfig, selection) {
  if (!selection) return false

  const positions = new Positions(annotationData, selection)

  const selectedString = annotationData.sourceDoc.substring(
    positions.begin,
    positions.end
  )

  const stringWithoutBlankCharacters = spanConfig.removeBlankChractors(
    selectedString
  )

  return stringWithoutBlankCharacters.length > 0
}
