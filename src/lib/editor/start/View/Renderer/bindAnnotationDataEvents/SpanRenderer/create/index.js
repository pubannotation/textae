import renderClassOfSpan from '../renderClassOfSpan'
import renderSingleSpan from './renderSingleSpan'
import renderEntitiesOfSpan from './renderEntitiesOfSpan'
import destroyChildrenSpan from './destroyChildrenSpan'
import renderChildrenSpan from './renderChildrenSpan'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function create(editor, annotationData, span, renderEntityFunc) {
  destroyChildrenSpan(span)

  const spanElement = document.querySelector(`#${span.id}`)
  if (spanElement) {
    spanElement.setAttribute('tabindex', 0)
    spanElement.classList.add('textae-editor__span')
  } else {
    renderSingleSpan(editor, annotationData, span)
  }

  renderClassOfSpan(annotationData, span)
  renderChildrenSpan(span, (span) =>
    create(editor, annotationData, span, renderEntityFunc)
  )

  // When the child spans contain bold style spans, the width of the parent span changes.
  // Render the entity after the child span has been rendered.
  renderEntitiesOfSpan(span, renderEntityFunc)
}
