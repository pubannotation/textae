import getAnnotationBox from '../../../../../getAnnotationBox'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function (editor, span, entityRenderer) {
  span.traverse((span) => {
    if (span.element !== null) {
      span.destroyElement()
    }
  })

  span.traverse(
    (span) => span.renderElement(getAnnotationBox(editor)),
    (span) => {
      // When the child spans contain bold style spans, the width of the parent span changes.
      // Render the entity after the child span has been rendered.
      for (const entity of span.entities) {
        entityRenderer.render(entity)
      }
    }
  )
}
