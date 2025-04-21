import SimpleInlineTextAnnotation from 'simple-inline-text-annotation'

export default function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    return SimpleInlineTextAnnotation.generate(editedData)
  }
}
