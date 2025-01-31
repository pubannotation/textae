import FormatConversionError from './exceptions/FormatConversionError'

export default class JSONAnnotationConverter {
  #url
  constructor(url) {
    this.#url = url
  }

  async toInline(jsonAnnotation) {
    const response = await fetch(this.#url, {
      method: 'POST',
      body: JSON.stringify(jsonAnnotation),
      headers: {
        'Content-type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new FormatConversionError(errorMessage)
    }

    return await response.text()
  }
}
