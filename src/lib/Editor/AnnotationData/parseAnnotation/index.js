import readTrackTo from './readTrackTo'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'
import validateAnnotation from './validateAnnotation'

export default function (annotationData, rowData) {
  const { span, entity, attribute, relation } = annotationData
  const { text } = rowData
  const spans = getAllSpansOf(rowData)

  const hasMultiTracks = Boolean(rowData.tracks)

  const trackRejects = parseTracks(
    span,
    entity,
    attribute,
    relation,
    text,
    spans,
    rowData
  )

  const { accept, reject: rootReject } = validateAnnotation(
    text,
    spans,
    rowData
  )
  readTrackTo(span, entity, attribute, relation, accept)
  rootReject.name = 'Root annotations.'

  // Read namespaces
  if (rowData.namespaces) {
    annotationData.namespace.addSource(
      rowData.namespaces.map((n) => ({
        id: n.prefix,
        ...n
      }))
    )
  } else {
    annotationData.namespace.addSource([])
  }

  const rejects = [rootReject].concat(trackRejects)

  return {
    hasMultiTracks,
    rejects
  }
}
