import parseAnnotation from './parseAnnotation'
import importNamespace from './importNamespace'
import parseTracks from './parseTracks'

export default function(dataStore, rowData) {
  const [multitrack, multitrackRejects] = parseTracks(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    rowData.text,
    rowData
  )
  const annotationReject = parseAnnotation(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    rowData.text,
    rowData
  )
  annotationReject.name = 'Root annotations.'
  importNamespace(dataStore.namespace, rowData.namespaces || [])

  const rejects = [annotationReject].concat(multitrackRejects)
  const hasError = rejects.some((r) => r.hasError)

  return {
    multitrack,
    hasError,
    rejects
  }
}
