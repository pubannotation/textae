import AnnotationConverter from '../../../AnnotationConverter'

export default async function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    return await AnnotationConverter.json2inline(editedData)
  }
}
