import create from './create'
import destroy from './destroy'
import renderClassOfSpan from './renderClassOfSpan'

export default class {
  constructor(annotationData, isBlockFunc, renderEntityFunc) {
    this.annotationData = annotationData
    this.isBlockFunc = isBlockFunc
    this.renderEntityFunc = renderEntityFunc
  }

  render(span) {
    create(this.annotationData, span, this.isBlockFunc, this.renderEntityFunc)
  }

  remove(span) {
    destroy(span.id)
  }

  change(span) {
    renderClassOfSpan(span, this.isBlockFunc)
  }
}
