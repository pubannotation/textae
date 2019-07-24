import parseAnnotation from './parseAnnotation'
import importNamespace from './parseAnnotation/importAnnotation/namespace'

export default function(dataStore, annotation) {
  parseBaseText(dataStore.paragraph, annotation.text)

  dataStore.sourceDoc = annotation.text
  dataStore.config = annotation.config

  return parseDennotation(dataStore, annotation)
}

function parseBaseText(paragraph, sourceDoc) {
  paragraph.addSource(sourceDoc)
}

function parseTracks(
  span,
  entity,
  attribute,
  relation,
  modification,
  paragraph,
  text,
  annotation
) {
  if (!annotation.tracks) return [false, []]

  const tracks = annotation.tracks
  delete annotation.tracks

  const rejects = tracks.map((track, i) => {
    const number = i + 1
    const prefix = `track${number}_`
    const reject = parseAnnotation(
      span,
      entity,
      attribute,
      relation,
      modification,
      paragraph,
      text,
      track,
      prefix
    )

    reject.name = `Track ${number} annotations.`
    return reject
  })

  return [true, rejects]
}

function parseDennotation(dataStore, annotation) {
  const tracks = parseTracks(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    dataStore.modification,
    dataStore.paragraph,
    annotation.text,
    annotation
  )
  const annotationReject = parseAnnotation(
    dataStore.span,
    dataStore.entity,
    dataStore.attribute,
    dataStore.relation,
    dataStore.modification,
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
