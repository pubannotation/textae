import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import setLineHeight from './lineHeight/setLineHeight'
import getLineHeight from './lineHeight/getLineHeight'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function(editor, annotationData, typeGap) {
  if (annotationData.span.all.length === 0) {
    // You need to adjust the padding-top according to the line-height.
    // Call setLineHeight even if there is no span.
    setLineHeight(editor, getLineHeight(editor))
  } else {
    const maxHeight = Math.max(
      ...annotationData.span.all.map((span) =>
        getHeightIncludeDescendantGrids(span, typeGap, annotationData)
      )
    )
    setLineHeight(editor, maxHeight + TEXT_HEIGHT + MARGIN_TOP)
  }
}
