import updateAllTypeGaps from './updateAllTypeGaps'

export default function(typeGap, editor, textBox, annotationPosition) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    textBox.updateLineHeight()
    annotationPosition.update()
  })
}
