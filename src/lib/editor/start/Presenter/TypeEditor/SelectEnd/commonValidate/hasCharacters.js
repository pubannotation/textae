import getBeginEnd from '../getBeginEnd'

// A span cannot be created include nonEdgeCharacters only.
export default function(annotationData, spanConfig, selection) {
  if (!selection) return false

  const [begin, end] = getBeginEnd(annotationData, selection)
  const selectedString = annotationData.sourceDoc.substring(begin, end)
  const stringWithoutBlankCharacters = spanConfig.removeBlankChractors(
    selectedString
  )
  return stringWithoutBlankCharacters.length > 0
}
