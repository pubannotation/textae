import renderClassOfSpan from '../renderClassOfSpan'
import getBigBrother from './getBigBrother'
import renderSingleSpan from './renderSingleSpan'
import renderEntitiesOfSpan from './renderEntitiesOfSpan'
import destroyChildrenSpan from './destroyChildrenSpan'
import renderChildresnSpan from './renderChildresnSpan'

export default create

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
function create(annotationData, span, isBlockFunc, renderEntityFunc) {
  destroyChildrenSpan(span)

  const bigBrother = getBigBrother(span, annotationData.span.topLevel())

  renderSingleSpan(span, bigBrother)

  renderClassOfSpan(
      span,
      isBlockFunc
  )

  renderEntitiesOfSpan(
      span,
      (id) => annotationData.entity.get(id),
      renderEntityFunc
  )

  renderChildresnSpan(
      span,
      span => create(annotationData, span, isBlockFunc, renderEntityFunc)
  )
}
