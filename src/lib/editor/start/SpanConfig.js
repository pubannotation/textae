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

export default class SpanConfig {
  constructor() {
    this._delimiterCharacters = []
    this._blankCharacters = []
  }

  set(config) {
    const settings = { ...defaults, ...config }

    this._delimiterCharacters = settings['delimiter characters']
    this._blankCharacters = settings['non-edge characters']
    return config
  }

  isDelimiter(char) {
    if (this._delimiterCharacters.indexOf('ANY') >= 0) {
      return 1
    }

    return this._delimiterCharacters.indexOf(char) >= 0
  }

  isBlankCharacter(char) {
    return this._blankCharacters.indexOf(char) >= 0
  }

  removeBlankChractors(str) {
    for (const char of this._blankCharacters) {
      str = str.replaceAll(char, '')
    }

    return str
  }
}
