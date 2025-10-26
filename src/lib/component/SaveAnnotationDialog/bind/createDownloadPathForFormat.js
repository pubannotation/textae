import SimpleInlineTextAnnotation from '@pubann/simple-inline-text-annotation'
import createDownloadPath from '../../createDownloadPath'

export default function createDownloadPathForFormat(data, format) {
  if (format === 'json') {
    return createDownloadPath(data)
  } else if (format === 'inline') {
    const inlineData = SimpleInlineTextAnnotation.generate(data)

    const blob = new Blob([inlineData], { type: 'text/plain;charset=utf-8' })
    return URL.createObjectURL(blob)
  }
}
