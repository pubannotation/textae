import pixelToInt from '../../pixelToInt'

export default function(textBox, heightValue) {
  const beforeLineHeight = textBox.style.lineHeight
  const b = pixelToInt(beforeLineHeight)
  if (b) {
    window.scroll(window.scrollX, (window.scrollY * heightValue) / b)
  }
}
