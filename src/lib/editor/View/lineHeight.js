import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getTextBox from './getTextBox'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30
const MINIMUM_HEIGHT = 41

export function get(editor) {
  let textBox = getTextBox(editor),
    style = window.getComputedStyle(textBox)

  return pixelToInt(style.lineHeight)
}

// Reduce the space under the .textae-editor__body__text-box same as padding-top.
export function reduceBottomSpace(editor) {
  let textBox = getTextBox(editor),
    style = window.getComputedStyle(textBox)

  // The height calculated by auto is exclude the value of the padding top.
  // Rest small space.
  textBox.style.height = 'auto'
  textBox.style.height = textBox.offsetHeight - pixelToInt(style.paddingTop) + 20 + 'px'
}

export function set(editor, heightValue) {
  let textBox = getTextBox(editor)

  textBox.style.lineHeight = heightValue + 'px'
  textBox.style.paddingTop = heightValue / 2 + 'px'

  suppressScrollJump(textBox, heightValue)

  reduceBottomSpace(editor)
}

export function setToTypeGap(editor, annotationData, typeContainer, typeGapValue) {
  let heightOfType = typeGapValue * 18 + 18,
    maxHeight

  if (annotationData.span.all().length === 0) {
    let style = window.getComputedStyle(editor),
      n = pixelToInt(style.lineHeight)

    if (style.lineHeight === 'normal') {
      maxHeight = MINIMUM_HEIGHT
    } else {
      maxHeight = n
    }
  } else {
    maxHeight = _.max(
      annotationData.span.all()
      .map(span => getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue))
    )

    maxHeight += TEXT_HEIGHT + MARGIN_TOP
  }

  set(editor, maxHeight)
}

function suppressScrollJump(textBox, heightValue) {
  let beforeLineHeight = textBox.style.lineHeight,
    b = pixelToInt(beforeLineHeight)

  if (b) {
    window.scroll(window.scrollX, window.scrollY * heightValue / b)
  }
}

function pixelToInt(str) {
  return str === '' ? 0 : parseInt(str, 10)
}
