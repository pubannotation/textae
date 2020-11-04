export default function (span, textBox) {
  const bg = span.backgroundElement
  const rect = span.rectangle

  bg.style.top = `${rect.top - textBox.lineHeight / 2 + 20}px`
  bg.style.left = `${rect.left - textBox.boundingClientRect.left}px`
  bg.style.width = `${rect.width}px`
  bg.style.height = `${rect.height}px`
}
