export default function (textBox, heightValue, additionalPaddingTop) {
  textBox.style.lineHeight = `${heightValue}px`
  textBox.style.paddingTop = `${heightValue / 2 + additionalPaddingTop}px`
}
