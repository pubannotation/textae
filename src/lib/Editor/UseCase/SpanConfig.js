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

  get delimiterCharacters() {
    return this._delimiterCharacters
  }

  get blankCharacters() {
    return this._blankCharacters
  }

  addDelimiterCharacter(char) {
    if (!this._delimiterCharacters.includes(char)) {
      this._delimiterCharacters.push(char)
    }
  }

  addBlankCharacter(char) {
    if (!this._blankCharacters.includes(char)) {
      this._blankCharacters.push(char)
    }
  }

  deleteDelimiterCharacter(char) {
    this._delimiterCharacters = this._delimiterCharacters.filter(
      (c) => c !== char
    )
  }

  deleteBlankCharacter(char) {
    this._blankCharacters = this._blankCharacters.filter((c) => c !== char)
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

  removeBlankCharacters(str) {
    for (const char of this._blankCharacters) {
      str = str.replaceAll(char, '')
    }

    return str
  }
}
