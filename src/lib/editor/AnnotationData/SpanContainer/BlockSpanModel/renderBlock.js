import createRangeToSpan from '../createRangeToSpan'

export default function (span) {
  const targetRange = createRangeToSpan(span)
  const spanElement = document.createElement('div')

  spanElement.setAttribute('id', span.id)
  spanElement.setAttribute('title', span.id)
  spanElement.classList.add('textae-editor__block')

  targetRange.surroundContents(spanElement)
}
