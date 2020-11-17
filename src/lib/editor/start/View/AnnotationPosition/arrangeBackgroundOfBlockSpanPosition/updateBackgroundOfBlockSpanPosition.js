// Leave a gap between the text and the block border.
const gapBetweenText = 8

export default function (span, textBox) {
  const bg = span.backgroundElement
  const rect = span.rectangle

  bg.style.top = `${rect.top - textBox.lineHeight / 2 + 20}px`
  bg.style.left = `${
    rect.left - textBox.boundingClientRect.left - gapBetweenText
  }px`
  bg.style.width = `${rect.width + gapBetweenText}px`
  bg.style.height = `${rect.height}px`
}
