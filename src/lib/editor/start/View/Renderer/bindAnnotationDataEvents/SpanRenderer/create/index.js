import renderSingleSpan from './renderSingleSpan'
import renderEntitiesOfSpan from './renderEntitiesOfSpan'
import destroy from '../destroy'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function(editor, span, renderEntityFunc) {
  span.traverse((span) => {
    if (span.element !== null) {
      destroy(span)
    }
  })

  span.traverse(
    (span) => renderSingleSpan(editor, span),
    (span) => {
      // When the child spans contain bold style spans, the width of the parent span changes.
      // Render the entity after the child span has been rendered.
      renderEntitiesOfSpan(span, renderEntityFunc)
    }
  )
}
