import updateAllTypeGaps from './updateAllTypeGaps'

export default function (
  entityGap,
  annotationData,
  textBox,
  annotationPosition,
  gridRectangle
) {
  entityGap.bind((newValue) => {
    updateAllTypeGaps(annotationData, newValue)
    textBox.updateLineHeight(gridRectangle)
    annotationPosition.update()
  })
}
