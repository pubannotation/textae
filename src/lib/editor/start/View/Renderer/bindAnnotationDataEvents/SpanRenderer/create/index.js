import renderBlock from './renderBlock'
import renderBackgroundOfBlockSpan from './renderBackgroundOfBlockSpan'
import getAnnotationBox from '../../../getAnnotationBox'
import createSpanElement from './createSpanElement'
import createRangeToSpan from './createRangeToSpan'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function (editor, span, entityRenderer) {
  span.traverse((span) => {
    if (span.element !== null) {
      span.destroyElement()
    }
  })

  span.traverse(
    (span) => {
      if (span.isBlock) {
        renderBlock(span)
        // Place the background in the annotation box
        // to shift the background up by half a line from the block span area.
        renderBackgroundOfBlockSpan(getAnnotationBox(editor), span)
      } else {
        const targetRange = createRangeToSpan(span)
        const spanElement = createSpanElement(span)

        targetRange.surroundContents(spanElement)
      }
    },
    (span) => {
      // When the child spans contain bold style spans, the width of the parent span changes.
      // Render the entity after the child span has been rendered.
      for (const entity of span.entities) {
        entityRenderer.render(entity)
      }
    }
  )
}
