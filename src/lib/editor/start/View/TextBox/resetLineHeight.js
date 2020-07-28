import getTextBox from './getTextBox'

export default function(editor) {
  const textBox = getTextBox(editor)
  textBox.style.lineHeight = null
  textBox.style.paddingTop = null
  textBox.style.height = null
}
