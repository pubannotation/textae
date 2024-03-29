import getSpanValidation from './getSpanValidation'
import isIDUnique from './isIDUnique'

export default function (text, denotations, spanOfAllTracks, spansInTrack) {
  return getSpanValidation(denotations, text, spanOfAllTracks, 'denotations')
    .and('uniqueID', (n) => isIDUnique(spansInTrack, n))
    .validateAll()
}
