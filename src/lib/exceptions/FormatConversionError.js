export default class FormatConversionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FormatConversionError'
  }
}
