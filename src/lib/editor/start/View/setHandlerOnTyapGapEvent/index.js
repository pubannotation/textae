import setLineHeightToTypeGap from '../setLineHeightToTypeGap'
import updateAllTypeGaps from './updateAllTypeGaps'

export default function(
  editor,
  annotationData,
  typeGap,
  typeDefinition,
  annotationPosition
) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    setLineHeightToTypeGap(editor[0], annotationData, typeDefinition, newValue)
    annotationPosition.update(newValue)
  })
}
