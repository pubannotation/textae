import readAcceptedAnnotationTo from './readAcceptedAnnotationTo'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'
import validateAnnotation from './validateAnnotation'

export default class AnnotationParser {
  constructor(namespace, span, entity, attribute, relation, rowData) {
    this._namespace = namespace
    this._span = span
    this._entity = entity
    this._attribute = attribute
    this._relation = relation
    this._rowData = rowData
  }

  parse() {
    // Read namespaces
    if (this._rowData.namespaces) {
      this._namespace.addSource(
        this._rowData.namespaces.map((n) => ({
          id: n.prefix,
          ...n
        }))
      )
    } else {
      this._namespace.addSource([])
    }

    // Read the root annotation.
    const { accept, reject } = validateAnnotation(
      this._text,
      this._spans,
      this._rowData
    )

    readAcceptedAnnotationTo(
      this._span,
      this._entity,
      this._attribute,
      this._relation,
      accept
    )

    reject.name = 'Root annotations.'
    this._rootReject = reject

    // Read multiple track annotations.
    if (this.hasMultiTracks) {
      this._trackRejects = parseTracks(
        this._span,
        this._entity,
        this._attribute,
        this._relation,
        this._text,
        this._spans,
        this._rowData
      )
    }
  }

  get hasMultiTracks() {
    return Boolean(this._rowData.tracks)
  }

  get rejects() {
    if (this.hasMultiTracks) {
      return [this._rootReject].concat(this._trackRejects)
    } else {
      return [this._rootReject]
    }
  }

  get _text() {
    return this._rowData.text
  }

  get _spans() {
    return getAllSpansOf(this._rowData)
  }
}
