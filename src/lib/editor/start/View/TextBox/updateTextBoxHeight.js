import getTextBox from './getTextBox'
import pixelToInt from './pixelToInt'

// Reduce the space under the .textae-editor__body__text-box same as padding-top.
export default function(editor) {
  const textBox = getTextBox(editor)
  const style = window.getComputedStyle(textBox)

  // The height calculated by auto is exclude the value of the padding top.
  // Rest small space.
  textBox.style.height = 'auto'
  textBox.style.height = `${textBox.offsetHeight -
    pixelToInt(style.paddingTop) +
    20}px`
}
