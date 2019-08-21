const validPropMap = new Map([
  ['entity types', ['id', 'label', 'color', 'default', 'type']],
  ['relation types', ['id', 'label', 'color', 'default', 'type']],
  ['delimiter characters', ''],
  ['non-edge characters', '']
])

export default function(config) {
  if (!config) {
    return false
  }

  for (const prop of Object.keys(config)) {
    if (!validPropMap.has(prop)) {
      // prop is unknown.
      return false
    }

    if (prop === 'entity types' || prop === 'relation types') {
      for (const type of config[prop]) {
        for (const propOfType of Object.keys(type)) {
          // propOfType is unknown
          if (!validPropMap.get(prop).includes(propOfType)) {
            return false
          }
        }
      }
    }
  }

  return true
}
