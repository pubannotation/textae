import setLineHeightToTypeGap from '../setLineHeightToTypeGap'
import updateAllTypeGaps from './updateAllTypeGaps'

export default function(
  typeGap,
  editor,
  annotationData,
  typeDefinition,
  annotationPosition
) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    setLineHeightToTypeGap(editor[0], annotationData, typeDefinition, newValue)
    annotationPosition.update(newValue)
  })
}
