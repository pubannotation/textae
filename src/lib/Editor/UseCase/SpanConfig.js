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
  #delimiterCharacters
  #blankCharacters

  constructor() {
    this.#delimiterCharacters = []
    this.#blankCharacters = []
  }

  get delimiterCharacters() {
    return this.#delimiterCharacters
  }

  get blankCharacters() {
    return this.#blankCharacters
  }

  set(config) {
    const settings = { ...defaults, ...config }

    this.#delimiterCharacters = settings['delimiter characters']
    this.#blankCharacters = settings['non-edge characters']
    return config
  }

  isDelimiter(char) {
    if (this.#delimiterCharacters.indexOf('ANY') >= 0) {
      return 1
    }

    return this.#delimiterCharacters.indexOf(char) >= 0
  }

  isBlankCharacter(char) {
    return this.#blankCharacters.indexOf(char) >= 0
  }

  removeBlankCharacters(str) {
    for (const char of this.#blankCharacters) {
      str = str.replaceAll(char, '')
    }

    return str
  }
}
