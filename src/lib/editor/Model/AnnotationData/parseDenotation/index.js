import parseAnnotation from './parseAnnotation'
import importNamespace from './namespace'
import parseTracks from './parseTracks'

export default function(dataStore, annotation) {
  const tracks = parseTracks(
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
  return {
    multitrack: tracks[0],
    rejects: [annotationReject].concat(tracks[1])
  }
}
