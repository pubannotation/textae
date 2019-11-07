import setLineHeightToTypeGap from '../setLineHeightToTypeGap'
import updateAllTypeGaps from './updateAllTypeGaps'

export default function(typeGap, editor, annotationData, annotationPosition) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    setLineHeightToTypeGap(editor[0], annotationData, newValue)
    annotationPosition.update(newValue)
  })
}
