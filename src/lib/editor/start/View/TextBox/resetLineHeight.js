import getTextBox from './getTextBox'
import pixelToInt from './pixelToInt'

export default function(editor) {
  const textBox = getTextBox(editor)

  // The default value of the padding top conforms to the line height style of textae.
  textBox.style.lineHeight = null
  const style = window.getComputedStyle(textBox)
  textBox.style.paddingTop = `${pixelToInt(style.lineHeight) / 2}px`
}
