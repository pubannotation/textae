export default async function convertTextAnnotationToJSON(text) {
  try {
    const response = await fetch(
      'http://localhost:3000/conversions/inline2json',
      {
        method: 'POST',
        body: text,
        headers: {
          Accept: 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        `response.status = ${response.status}, response.statusText = ${response.statusText}`
      )
    }

    const convertedJSON = await response.json()
    return convertedJSON
  } catch (e) {
    console.error('Convert failed:', e)
    return null
  }
}
