import getTextBox from '../../getTextBox'
import updateTextBoxHeight from '../../updateTextBoxHeight'
import suppressScrollJump from './suppressScrollJump'

export default function(editor, heightValue) {
  const textBox = getTextBox(editor)
  textBox.style.lineHeight = `${heightValue}px`
  textBox.style.paddingTop = `${heightValue / 2}px`
  suppressScrollJump(textBox, heightValue)
  updateTextBoxHeight(editor)
}
