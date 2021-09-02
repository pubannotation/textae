import parseTrack from './parseTrack'

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
    const reject = parseTrack(
      spanContainer,
      entityContainer,
      attributeContainer,
      relationContainer,
      text,
      spans,
      track,
      trackNumber
    )
    reject.name = `Track ${number} annotations.`
    return reject
  })
  return [true, rejects]
}
