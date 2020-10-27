import updateAllTypeGaps from './updateAllTypeGaps'

export default function(
  typeGap,
  editor,
  textBox,
  annotationPosition,
  gridHeight
) {
  typeGap((newValue) => {
    updateAllTypeGaps(editor, newValue)
    textBox.updateLineHeight(gridHeight)
    annotationPosition.update()
  })
}
