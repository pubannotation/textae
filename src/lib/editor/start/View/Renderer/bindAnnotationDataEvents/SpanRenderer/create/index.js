import renderClassOfSpan from '../renderClassOfSpan'
import renderSingleSpan from './renderSingleSpan'
import renderEntitiesOfSpan from './renderEntitiesOfSpan'
import destroyChildrenSpan from './destroyChildrenSpan'
import renderChildrenSpan from './renderChildrenSpan'

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
export default function create(editor, annotationData, span, renderEntityFunc) {
  destroyChildrenSpan(span)

  renderSingleSpan(editor, annotationData, span)
  renderClassOfSpan(annotationData, span)
  renderEntitiesOfSpan(span, renderEntityFunc)
  renderChildrenSpan(span, (span) =>
    create(editor, annotationData, span, renderEntityFunc)
  )
}
