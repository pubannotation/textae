// The boundraries of elements in the typesetings and
// the denotations and blocks cannot cross each other.

import getAllSpansIn from './getAllSpansIn'

// The same is true when across the tracks.
export default function (rowData) {
  let spans = getAllSpansIn(rowData)

  if (rowData.tracks) {
    for (const track of rowData.tracks) {
      spans = spans.concat(getAllSpansIn(track))
    }
  }

  return spans
}
