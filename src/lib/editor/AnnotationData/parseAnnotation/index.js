import parseTrack from './parseTrack'
import importNamespace from './importNamespace'
import parseTracks from './parseTracks'

export default function (annotationData, rowData) {
  // The boundraries of elements in the typesetings and
  // the denotations and blocks cannot cross each other.
  // The same is true when across the tracks.
  let spans = []
  spans = spans
    .concat(rowData.typesettings || [])
    .concat(rowData.denotations || [])
    .concat(rowData.blocks || [])

  for (const track of rowData.tracks || []) {
    spans = spans
      .concat(track.typesettings || [])
      .concat(track.denotations || [])
      .concat(track.blocks || [])
  }

  const [multitrack, multitrackRejects] = parseTracks(
    annotationData.span,
    annotationData.entity,
    annotationData.attribute,
    annotationData.relation,
    rowData.text,
    spans,
    rowData
  )
  const annotationReject = parseTrack(
    annotationData.span,
    annotationData.entity,
    annotationData.attribute,
    annotationData.relation,
    rowData.text,
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
