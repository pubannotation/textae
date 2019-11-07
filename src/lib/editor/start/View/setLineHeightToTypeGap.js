import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import pixelToInt from './pixelToInt'
import setLineHeight from './lineHeight/setLineHeight'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function(editor, annotationData, typeGap) {
  let maxHeight
  if (annotationData.span.all.length === 0) {
    const style = window.getComputedStyle(editor)
    const n = pixelToInt(style.lineHeight)
    maxHeight = n
  } else {
    maxHeight = Math.max(
      ...annotationData.span.all.map((span) =>
        getHeightIncludeDescendantGrids(span, typeGap, annotationData)
      )
    )
    maxHeight += TEXT_HEIGHT + MARGIN_TOP
  }
  setLineHeight(editor, maxHeight)
}
