export default function (instances) {
  return instances.reduce((countMap, instance) => {
    const type = instance.typeName

    if (countMap.has(type)) {
      countMap.get(type).usage += 1
    } else {
      countMap.set(type, { usage: 1 })
    }

    return countMap
  }, new Map())
}
