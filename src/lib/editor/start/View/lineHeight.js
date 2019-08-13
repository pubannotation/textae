import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import getTextBox from './getTextBox'
import pixelToInt from './pixelToInt'
import updateTextBoxHeight from './updateTextBoxHeight'
import _ from 'underscore'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export function get(editor) {
  const textBox = getTextBox(editor)
  const style = window.getComputedStyle(textBox)

  return pixelToInt(style.lineHeight)
}

export function set(editor, heightValue) {
  const textBox = getTextBox(editor)

  textBox.style.lineHeight = `${heightValue}px`
  textBox.style.paddingTop = `${heightValue / 2}px`

  suppressScrollJump(textBox, heightValue)
  updateTextBoxHeight(editor)
}

export function setToTypeGap(editor, annotationData, typeDefinition, typeGap) {
  let maxHeight

  if (annotationData.span.all.length === 0) {
    const style = window.getComputedStyle(editor)
    const n = pixelToInt(style.lineHeight)

    maxHeight = n
  } else {
    maxHeight = _.max(
      annotationData.span.all.map((span) =>
        getHeightIncludeDescendantGrids(span, typeDefinition, typeGap)
      )
    )

    maxHeight += TEXT_HEIGHT + MARGIN_TOP
  }

  set(editor, maxHeight)
}

function suppressScrollJump(textBox, heightValue) {
  const beforeLineHeight = textBox.style.lineHeight
  const b = pixelToInt(beforeLineHeight)

  if (b) {
    window.scroll(window.scrollX, (window.scrollY * heightValue) / b)
  }
}
