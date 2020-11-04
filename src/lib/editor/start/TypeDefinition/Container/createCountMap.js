export default function (instances) {
  return instances.reduce((countMap, instance) => {
    const type = instance.typeName

    if (countMap.has(type)) {
      countMap.set(type, countMap.get(type) + 1)
    } else {
      countMap.set(type, 1)
    }

    return countMap
  }, new Map())
}
