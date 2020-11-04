export default function (span) {
  const element = document.createElement('span')

  element.setAttribute('id', span.id)
  element.setAttribute('title', span.id)

  if (!span.styleOnly) {
    element.setAttribute('tabindex', 0)
    element.classList.add('textae-editor__span')
  }

  for (const style of span.styles.values()) {
    element.classList.add(`textae-editor__style`)
    element.classList.add(`textae-editor__style--${style}`)
  }

  return element
}
