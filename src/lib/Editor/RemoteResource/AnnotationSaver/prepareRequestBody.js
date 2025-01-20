import convertJSONAnnotationToInline from '../../../convertJSONAnnotationToInline'

export default async function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    return await convertJSONAnnotationToInline(editedData)
  }
}
