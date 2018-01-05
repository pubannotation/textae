export default function(loadConfig) {
  let keys = Object.keys(loadConfig),
    validKeyMap = {
      'entity types': ['id', 'label', 'color', 'default', 'type'],
      'relation types': ['id', 'label', 'color', 'default', 'type'],
      'delimiter characters': '',
      'non-edge characters': ''
    },
    isValid = true

  keys.forEach((key) => {
    if (typeof validKeyMap[key] === 'undefined') {
      isValid = false
      return
    }

    if (Array.isArray(validKeyMap[key])) {
      loadConfig[key].forEach((type) => {
        let subKeys = Object.keys(type)
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
