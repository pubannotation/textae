import getTextBox from '../getTextBox'
import pixelToInt from '../pixelToInt'

export default function(editor) {
  const textBox = getTextBox(editor)
  const style = window.getComputedStyle(textBox)
  return pixelToInt(style.lineHeight)
}
