import parseAnnotation from './parseAnnotation'
import importNamespace from './namespace'
import parseTracks from './parseTracks'

export default function(dataStore, annotation) {
  const [multitrack, multitrackRejects] = parseTracks(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    dataStore.paragraph,
    annotation.text,
    annotation
  )
  const annotationReject = parseAnnotation(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    dataStore.paragraph,
    annotation.text,
    annotation
  )
  annotationReject.name = 'Root annotations.'
  importNamespace(dataStore.namespace, annotation.namespaces)

  const rejects = [annotationReject].concat(multitrackRejects)
  const hasError = rejects.some((r) => r.hasError)

  return {
    multitrack,
    hasError,
    rejects
  }
}
