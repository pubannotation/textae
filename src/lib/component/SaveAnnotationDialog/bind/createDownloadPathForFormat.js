import createDownloadPath from '../../createDownloadPath'
import AnnotationConverter from '../../../AnnotationConverter'

export default async function createDownloadPathForFormat(data, format) {
  if (format === 'json') {
    return createDownloadPath(data)
  } else if (format === 'inline') {
    const converter = new AnnotationConverter()
    const inlineData = await converter.json2inline(data)

    const blob = new Blob([inlineData], { type: 'text/plain' })
    return URL.createObjectURL(blob)
  }
}
