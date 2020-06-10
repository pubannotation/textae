import parseAnnotation from './parseAnnotation'

export default function(
  span,
  entity,
  attribute,
  relation,
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
