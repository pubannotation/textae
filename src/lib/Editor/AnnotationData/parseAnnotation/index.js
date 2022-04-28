import parseTrack from './parseTrack'
import parseTracks from './parseTracks'
import getAllSpansOf from './getAllSpansOf'

export default function (annotationData, rowData) {
  const { span, entity, attribute, relation } = annotationData
  const { text } = rowData
  const spans = getAllSpansOf(rowData)

  const [multitrack, multitrackRejects] = parseTracks(
    span,
    entity,
    attribute,
    relation,
    text,
    spans,
    rowData
  )
  const annotationReject = parseTrack(
    span,
    entity,
    attribute,
    relation,
    text,
    spans,
    rowData
  )
  annotationReject.name = 'Root annotations.'

  // Import namespaces
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

  const rejects = [annotationReject].concat(multitrackRejects)

  return {
    multitrack,
    rejects
  }
}
