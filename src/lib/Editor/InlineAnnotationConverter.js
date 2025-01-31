import FormatConversionError from '../exceptions/formatConversionError'

export default class InlineAnnotationConverter {
  #url
  constructor(url) {
    this.#url = url
  }

  async toJSON(inlineAnnotation) {
    const response = await fetch(this.#url, {
      method: 'POST',
      body: inlineAnnotation,
      headers: {
        'Content-type': 'text/markdown'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new FormatConversionError(errorMessage)
    }

    return await response.json()
  }
}
