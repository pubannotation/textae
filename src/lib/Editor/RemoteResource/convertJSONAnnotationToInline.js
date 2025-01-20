export default async function convertJSONAnnotationToInline(json) {
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
    const errorMessage = await response.text()
    console.error(errorMessage)
    return null
  }

  return await response.text()
}
