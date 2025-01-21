import AnnotationConverter from '../../../AnnotationConverter'

export default async function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    const converter = new AnnotationConverter()
    return await converter.json2inline(editedData)
  }
}
