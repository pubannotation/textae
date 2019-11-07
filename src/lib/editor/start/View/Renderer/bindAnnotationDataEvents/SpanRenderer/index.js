import create from './create'
import destroy from './destroy'
import renderClassOfSpan from './renderClassOfSpan'

export default class {
  constructor(annotationData, renderEntityFunc) {
    this.annotationData = annotationData
    this.renderEntityFunc = renderEntityFunc
  }

  render(span) {
    create(this.annotationData, span, this.renderEntityFunc)
  }

  remove(span) {
    destroy(span.id)
  }

  change(span) {
    renderClassOfSpan(this.annotationData, span)
  }
}
