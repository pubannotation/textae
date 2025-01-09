export default async function convertTextAnnotationToJSON(text) {
  try {
    const response = await fetch(
      'https://pubannotation.org/conversions/inline2json',
      {
        method: 'POST',
        body: text,
        headers: {
          'Content-type': 'text/markdown',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      response.text().then((errorMessage) => console.error(`${errorMessage}`))
      return null
    }

    const convertedJSON = await response.json()
    return convertedJSON
  } catch (e) {
    console.error(e)
    return null
  }
}
