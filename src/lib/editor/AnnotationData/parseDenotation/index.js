import parseAnnotation from './parseAnnotation'
import importNamespace from './importNamespace'
import parseTracks from './parseTracks'

export default function(annotationData, rowData) {
  const [multitrack, multitrackRejects] = parseTracks(
    annotationData.span,
    annotationData.entity,
    annotationData.attribute,
    annotationData.relation,
    rowData.text,
    rowData
  )
  const annotationReject = parseAnnotation(
    annotationData.span,
    annotationData.entity,
    annotationData.attribute,
    annotationData.relation,
    rowData.text,
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
