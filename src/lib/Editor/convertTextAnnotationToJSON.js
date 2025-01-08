export default async function convertTextAnnotationToJSON(text) {
  try {
    const response = await fetch(
      'https://pubannotation.org/conversions/inline2json',
      {
        method: 'POST',
        body: text,
        headers: {
          Accept: 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error(
        `Conversion failed: response.status = ${response.status}, response.statusText = ${response.statusText}`
      )
      return null
    }

    const convertedJSON = await response.json()
    return convertedJSON
  } catch (e) {
    console.error(e)
    return null
  }
}
