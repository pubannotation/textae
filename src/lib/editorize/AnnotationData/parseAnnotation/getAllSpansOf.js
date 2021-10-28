// The boundraries of elements in the typesetings and
// the denotations and blocks cannot cross each other.
// The same is true when across the tracks.
export default function (rowData) {
  const { typesettings, denotations, blocks } = rowData

  let spans = []
  spans = spans
    .concat(typesettings || [])
    .concat(denotations || [])
    .concat(blocks || [])

  if (rowData.tracks) {
    for (const { typesettings, denotations, blocks } of rowData.tracks) {
      spans = spans
        .concat(typesettings || [])
        .concat(denotations || [])
        .concat(blocks || [])
    }
  }

  return spans
}
