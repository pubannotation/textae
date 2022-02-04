import parseTrack from './parseTrack'
import importNamespace from './importNamespace'
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
  const hasError = rejects.some((r) => r.hasError)

  return {
    multitrack,
    hasError,
    rejects
  }
}
