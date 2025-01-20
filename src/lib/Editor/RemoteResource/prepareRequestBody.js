import convertJSONAnnotationToInline from './convertJSONAnnotationToInline'

export default async function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    const convertedData = await convertJSONAnnotationToInline(editedData)

    if (!convertedData) {
      throw new Error()
    }

    return convertedData
  }
}
