import pixelToInt from './pixelToInt'

export default function (textBox) {
  const style = window.getComputedStyle(textBox)
  return pixelToInt(style.lineHeight)
}
