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
  importNamespace(annotationData.namespace, rowData.namespaces || [])

  const rejects = [annotationReject].concat(multitrackRejects)

  return {
    multitrack,
    rejects
  }
}

function importNamespace(destination, source) {
  destination.addSource(
    source.map((namespace) => ({ id: namespace.prefix, ...namespace }))
  )
}
