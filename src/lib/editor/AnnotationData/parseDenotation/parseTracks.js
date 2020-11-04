import parseAnnotation from './parseAnnotation'

export default function (span, entity, attribute, relation, text, rowData) {
  if (!rowData.tracks) return [false, []]
  const tracks = rowData.tracks
  delete rowData.tracks
  const rejects = tracks.map((track, i) => {
    const number = i + 1
    const prefix = `track${number}_`
    const reject = parseAnnotation(
      span,
      entity,
      attribute,
      relation,
      text,
      track,
      prefix
    )
    reject.name = `Track ${number} annotations.`
    return reject
  })
  return [true, rejects]
}
