import getAnnotationBox from '../../../../../getAnnotationBox'

export default class SpanRenderer {
  constructor(editor, entityRenderer) {
    this._editor = editor
    this._entityRenderer = entityRenderer
  }

  render(span) {
    // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
    span.traverse((span) => {
      if (span.element !== null) {
        span.destroyElement()
      }
    })

    span.traverse(
      (span) => span.renderElement(getAnnotationBox(this._editor)),
      (span) => {
        // When the child spans contain bold style spans, the width of the parent span changes.
        // Render the entity after the child span has been rendered.
        for (const entity of span.entities) {
          this._entityRenderer.render(entity)
        }
      }
    )
  }

  remove(span) {
    if (span.hasStyle) {
      const spanElement = span.element
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      span.destroyElement()
    }
  }
}
