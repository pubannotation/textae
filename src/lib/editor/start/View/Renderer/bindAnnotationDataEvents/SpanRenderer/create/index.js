import renderDenotationSpan from './renderDenotationSpan'
import destroy from '../destroy'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function(span, entityRenderer) {
  span.traverse((span) => {
    if (span.element !== null) {
      destroy(span)
    }
  })

  span.traverse(
    (span) => renderDenotationSpan(span),
    (span) => {
      // When the child spans contain bold style spans, the width of the parent span changes.
      // Render the entity after the child span has been rendered.
      for (const entity of span.entities) {
        entityRenderer.render(entity)
      }
    }
  )
}
