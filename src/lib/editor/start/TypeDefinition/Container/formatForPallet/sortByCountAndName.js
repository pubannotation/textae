export default function (countTypeUse) {
  // Sort by number of types, and by name if numbers are same.
  const typeNames = Array.from(countTypeUse.keys())

  typeNames.sort((a, b) => {
    const diff = countTypeUse.get(b) - countTypeUse.get(a)
    return diff !== 0 ? diff : a > b ? 1 : a < b ? -1 : 0
  })

  return typeNames
}
