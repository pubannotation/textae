import updateAllTypeGaps from './updateAllTypeGaps'

export default function (
  typeGap,
  annotationData,
  textBox,
  annotationPosition,
  gridRectangle
) {
  typeGap((newValue) => {
    updateAllTypeGaps(annotationData, newValue)
    textBox.updateLineHeight(gridRectangle)
    annotationPosition.update()
  })
}
