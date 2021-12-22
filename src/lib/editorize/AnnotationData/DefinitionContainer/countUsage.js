export default function (map, instances) {
  for (const [key, value] of map.entries()) {
    map.set(key, { ...value, usage: 0 })
  }

  return instances.reduce((countMap, { typeName }) => {
    countMap.get(typeName).usage += 1

    return countMap
  }, map)
}
