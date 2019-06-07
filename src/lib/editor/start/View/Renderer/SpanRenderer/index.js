import create from './create'
import destroy from './destroy'
import renderClassOfSpan from './renderClassOfSpan'

export default function(annotationData, isBlockFunc, renderEntityFunc) {
  return {
    render: span => create(
        span,
        annotationData,
        isBlockFunc,
        renderEntityFunc
    ),
    remove: span => destroy(span.id),
    change: span => renderClassOfSpan(span, isBlockFunc)
  }
}
