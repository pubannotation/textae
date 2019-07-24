export default function(loadConfig) {
  const keys = Object.keys(loadConfig)
  const validKeyMap = {
    'entity types': ['id', 'label', 'color', 'default', 'type'],
    'relation types': ['id', 'label', 'color', 'default', 'type'],
    'delimiter characters': '',
    'non-edge characters': ''
  }
  let isValid = true

  keys.forEach((key) => {
    if (typeof validKeyMap[key] === 'undefined') {
      isValid = false
      return
    }

    if (Array.isArray(validKeyMap[key])) {
      loadConfig[key].forEach((type) => {
        const subKeys = Object.keys(type)
        subKeys.forEach((subKey) => {
          if (validKeyMap[key].indexOf(subKey) === -1) {
            isValid = false
            return
          }
        })
        if (isValid) {
          return
        }
      })
    }
  })

  return isValid
}
