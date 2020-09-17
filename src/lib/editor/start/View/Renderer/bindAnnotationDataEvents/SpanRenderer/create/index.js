import renderSingleSpan from './renderSingleSpan'
import renderEntitiesOfSpan from './renderEntitiesOfSpan'
import destroy from '../destroy'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function create(editor, span, renderEntityFunc) {
  span.traverse((span) => {
    if (document.querySelector(`#${span.id}`) !== null) {
      destroy(span.id)
    }
  })

  span.traverse(
    (span) => {
      const spanElement = document.querySelector(`#${span.id}`)
      if (spanElement) {
        spanElement.setAttribute('tabindex', 0)
        spanElement.classList.add('textae-editor__span')
      } else {
        renderSingleSpan(editor, span)
      }
    },
    (span) => {
      // When the child spans contain bold style spans, the width of the parent span changes.
      // Render the entity after the child span has been rendered.
      renderEntitiesOfSpan(span, renderEntityFunc)
    }
  )
}
