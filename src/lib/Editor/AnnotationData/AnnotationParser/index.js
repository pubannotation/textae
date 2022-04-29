import readTrackTo from './readTrackTo'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'
import validateAnnotation from './validateAnnotation'

export default class AnnotationParser {
  constructor(annotationData, rowData) {
    this._annotationData = annotationData
    this._rowData = rowData
  }

  parse() {
    const { span, entity, attribute, relation } = this._annotationData
    const { text } = this._rowData
    const spans = getAllSpansOf(this._rowData)

    const { accept, reject } = validateAnnotation(text, spans, this._rowData)
    readTrackTo(span, entity, attribute, relation, accept)

    this._rootReject = reject
    this._rootReject.name = 'Root annotations.'

    // Read namespaces
    if (this._rowData.namespaces) {
      this._annotationData.namespace.addSource(
        this._rowData.namespaces.map((n) => ({
          id: n.prefix,
          ...n
        }))
      )
    } else {
      this._annotationData.namespace.addSource([])
    }

    if (this.hasMultiTracks) {
      this._trackRejects = parseTracks(
        span,
        entity,
        attribute,
        relation,
        text,
        spans,
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
}
