import * as lineHeight from '../lineHeight'
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
    lineHeight.setToTypeGap(editor[0], annotationData, typeDefinition, newValue)
    annotationPosition.update(newValue)
  })
}
