import parseTrack from './parseTrack'

export default function (span, entity, attribute, relation, text, rowData) {
  if (!rowData.tracks) return [false, []]
  const { tracks } = rowData
  delete rowData.tracks
  const rejects = tracks.map((track, i) => {
    const number = i + 1
    const trackNumber = `track${number}_`
    const reject = parseTrack(
      span,
      entity,
      attribute,
      relation,
      text,
      track,
      trackNumber
    )
    reject.name = `Track ${number} annotations.`
    return reject
  })
  return [true, rejects]
}
