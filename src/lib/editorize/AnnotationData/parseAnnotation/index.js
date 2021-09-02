import parseTrack from './parseTrack'
import importNamespace from './importNamespace'
import parseTracks from './parseTracks'

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

// The boundraries of elements in the typesetings and
// the denotations and blocks cannot cross each other.
// The same is true when across the tracks.
function getAllSpansOf(rowData) {
  const { typesettings, denotations, blocks } = rowData

  let spans = []
  spans = spans
    .concat(typesettings || [])
    .concat(denotations || [])
    .concat(blocks || [])

  if (rowData.tracks) {
    for (const { typesettings, denotations, blocks } of rowData.tracks) {
      spans = spans
        .concat(typesettings || [])
        .concat(denotations || [])
        .concat(blocks || [])
    }
  }

  return spans
}
