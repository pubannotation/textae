// The default value is the value of the first object of the most frequent object.
export default function (objects) {
  const objectFrequencyMap = objects.reduce((map, obj) => {
    if (map.has(obj)) {
      return map.set(obj, map.get(obj) + 1)
    } else {
      return map.set(obj, 1)
    }
  }, new Map())

  const maximumFrequency = Math.max(...objectFrequencyMap.values())

  for (const [obj, frq] of objectFrequencyMap.entries()) {
    if (frq === maximumFrequency) {
      return obj
    }
  }
}
