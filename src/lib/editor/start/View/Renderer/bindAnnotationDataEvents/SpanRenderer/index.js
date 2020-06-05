import create from './create'
import destroy from './destroy'
import renderClassOfSpan from './renderClassOfSpan'

export default class {
  constructor(editor, annotationData, renderEntityFunc) {
    this._editor = editor
    this._annotationData = annotationData
    this._renderEntityFunc = renderEntityFunc
  }

  render(span) {
    create(this._editor, this._annotationData, span, this._renderEntityFunc)
  }

  remove(span) {
    destroy(span.id)
  }

  change(span) {
    renderClassOfSpan(this._annotationData, span)
  }
}
