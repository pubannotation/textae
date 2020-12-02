import updateAllTypeGaps from './updateAllTypeGaps'

export default function (
  displayInstance,
  annotationData,
  textBox,
  annotationPosition,
  gridRectangle
) {
  displayInstance.bind((newValue) => {
    updateAllTypeGaps(annotationData, newValue)
    textBox.updateLineHeight(gridRectangle)
    annotationPosition.update()
  })
}
