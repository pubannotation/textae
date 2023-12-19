import readAcceptedAnnotationTo from './readAcceptedAnnotationTo'
import validateAnnotation from './validateAnnotation'

export default function (
  spanContainer,
  entityContainer,
  attributeContainer,
  relationContainer,
  text,
  spans,
  rowData
) {
  console.assert(rowData.tracks)

  const { tracks } = rowData

  return tracks.map((track, i) => {
    const number = i + 1
    const trackNumber = `track${number}_`

    const { accept, reject } = validateAnnotation(text, spans, track)
    readAcceptedAnnotationTo(
      spanContainer,
      entityContainer,
      attributeContainer,
      relationContainer,
      accept,
      trackNumber
    )
    reject.name = `Track ${number} annotations.`
    return reject
  })
}
