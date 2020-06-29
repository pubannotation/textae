import getTextBox from '../getTextBox'
import updateTextBoxHeight from '../updateTextBoxHeight'

export default function(editor, heightValue) {
  const textBox = getTextBox(editor)
  textBox.style.lineHeight = `${heightValue}px`
  textBox.style.paddingTop = `${heightValue / 2}px`
  updateTextBoxHeight(editor)
}
