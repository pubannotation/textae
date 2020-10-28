import updateAllTypeGaps from './updateAllTypeGaps'

export default function(
  typeGap,
  editor,
  textBox,
  annotationPosition,
  gridRectangle
) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    textBox.updateLineHeight(gridRectangle)
    annotationPosition.update()
  })
}
