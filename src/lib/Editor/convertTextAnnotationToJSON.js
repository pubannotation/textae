export default async function convertTextAnnotationToJSON(text) {
  const response = await fetch(
    'https://pubannotation.org/conversions/inline2json',
    {
      method: 'POST',
      body: text,
      headers: {
        'Content-type': 'text/markdown',
        Accept: 'application/json'
      }
    }
  )

  if (!response.ok) {
    const errorMessage = await response.text()
    throw Error(errorMessage)
  }

  return await response.json()
}
