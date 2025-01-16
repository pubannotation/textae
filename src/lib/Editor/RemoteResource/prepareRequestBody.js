import convertJSONAnnotationToInline from './convertJSONAnnotationToInline'

export default function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return Promise.resolve(JSON.stringify(editedData))
  } else if (format === 'inline') {
    return convertJSONAnnotationToInline(editedData)
      .then((convertedData) => {
        if (convertedData) {
          return convertedData
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {
        return Promise.reject()
      })
  }
}
