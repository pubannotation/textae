export default async function convertJSONAnnotationToInline(json) {
  try {
    const response = await fetch(
      'https://pubannotation.org/conversions/json2inline',
      {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      response.text().then((errorMessage) => console.error(`${errorMessage}`))
      return null
    }

    const inlineAnnotation = await response.text()
    return inlineAnnotation
  } catch (e) {
    console.error(e)
    return null
  }
}
