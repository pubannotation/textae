const defaults = {
  'delimiter characters': [
    ' ',
    '.',
    '!',
    '?',
    ',',
    ':',
    ';',
    '-',
    '/',
    '&',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '+',
    '*',
    '\\',
    '"',
    "'",
    '\n',
    '–'
  ],
  'non-edge characters': [' ', '\n']
}

export default function() {
  let delimiterCharacters = []
  let blankCharacters = []

  const set = (config) => {
    const settings = Object.assign({}, defaults, config)

    delimiterCharacters = settings['delimiter characters']
    blankCharacters = settings['non-edge characters']
    return config
  }

  const reset = () => set(defaults)

  const isDelimiter = (char) => {
    if (delimiterCharacters.indexOf('ANY') >= 0) {
      return 1
    }

    return delimiterCharacters.indexOf(char) >= 0
  }

  const isBlankCharacter = (char) => blankCharacters.indexOf(char) >= 0

  const removeBlankChractors = (str) => {
    for (const char of blankCharacters) {
      str = str.replace(char, '')
    }

    return str
  }

  return {
    reset,
    set,
    isDelimiter,
    isBlankCharacter,
    removeBlankChractors
  }
}
