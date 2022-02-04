export default function (track) {
  const { typesettings, denotations, blocks } = track
  return (typesettings || []).concat(denotations || []).concat(blocks || [])
}
