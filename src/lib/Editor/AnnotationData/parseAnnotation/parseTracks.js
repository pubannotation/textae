import parseTrack from './parseTrack'
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
  if (!rowData.tracks) return [false, []]
  const { tracks } = rowData
  delete rowData.tracks
  const rejects = tracks.map((track, i) => {
    const number = i + 1
    const trackNumber = `track${number}_`

    const { accept, reject } = validateAnnotation(text, spans, track)
    parseTrack(
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
  return [true, rejects]
}
