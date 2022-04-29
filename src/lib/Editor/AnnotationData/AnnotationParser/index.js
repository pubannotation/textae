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

    const { accept, reject: rootReject } = validateAnnotation(
      text,
      spans,
      this._rowData
    )
    readTrackTo(span, entity, attribute, relation, accept)
    rootReject.name = 'Root annotations.'

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

    let rejects = [rootReject]

    if (this.hasMultiTracks) {
      const trackRejects = parseTracks(
        span,
        entity,
        attribute,
        relation,
        text,
        spans,
        this._rowData
      )
      rejects = [rootReject].concat(trackRejects)
    }

    return rejects
  }

  get hasMultiTracks() {
    return Boolean(this._rowData.tracks)
  }
}
