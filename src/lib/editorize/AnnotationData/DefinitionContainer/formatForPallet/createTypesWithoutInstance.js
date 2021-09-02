export default function (defindTypeNames, countMap) {
  const typesWithoutInstance = []
  for (const type of defindTypeNames) {
    if (!countMap.has(type)) {
      typesWithoutInstance.push(type)
    }
  }

  // Sort by name
  typesWithoutInstance.sort((a, b) => {
    return a > b ? 1 : a < b ? -1 : 0
  })

  return typesWithoutInstance
}
