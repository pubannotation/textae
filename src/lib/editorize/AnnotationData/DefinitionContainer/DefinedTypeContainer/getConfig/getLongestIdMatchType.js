export default function (typeIds) {
  let longestMatchId = ''

  for (const id of typeIds) {
    if (id.length > longestMatchId.length) {
      longestMatchId = id
    }
  }

  return longestMatchId
}
