export default function(span) {
  const element = document.createElement('span')

  element.setAttribute('id', span.id)
  element.setAttribute('title', span.id)
  element.setAttribute('class', 'textae-editor__span')
  element.setAttribute('tabindex', 0)

  return element
}
