import createDownloadPath from '../../createDownloadPath'
import convertJSONAnnotationToInline from '../../../convertJSONAnnotationToInline'

export default async function createDownloadPathForFormat(data, format) {
  if (format === 'json') {
    return createDownloadPath(data)
  } else if (format === 'inline') {
    const inlineData = await convertJSONAnnotationToInline(data)

    const blob = new Blob([inlineData], { type: 'text/plain' })
    return URL.createObjectURL(blob)
  }
}
