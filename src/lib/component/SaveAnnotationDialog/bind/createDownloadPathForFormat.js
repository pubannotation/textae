import createDownloadPath from '../../createDownloadPath'
import JSONAnnotationConverter from '../../../JSONAnnotationConverter'

export default async function createDownloadPathForFormat(data, format) {
  if (format === 'json') {
    return createDownloadPath(data)
  } else if (format === 'inline') {
    const inlineData = await new JSONAnnotationConverter(
      'https://pubannotation.org/conversions/json2inline'
    ).toInline(data)

    const blob = new Blob([inlineData], { type: 'text/plain;charset=utf-8' })
    return URL.createObjectURL(blob)
  }
}
