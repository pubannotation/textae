export default class AnnotationConverter {
  static async inline2json(inlineAnnotation) {
    const url = 'https://pubannotation.org/conversions/inline2json'
    const response = await fetch(url, {
      method: 'POST',
      body: inlineAnnotation,
      headers: {
        'Content-type': 'text/markdown'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw Error(errorMessage)
    }

    return await response.json()
  }

  static async json2inline(jsonAnnotation) {
    const url = 'http://localhost:3000/conversions/json2inline'
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(jsonAnnotation),
      headers: {
        'Content-type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw Error(errorMessage)
    }

    return await response.text()
  }
}
