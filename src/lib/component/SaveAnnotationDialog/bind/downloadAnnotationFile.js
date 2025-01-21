import createDownloadPath from '../../createDownloadPath'
import convertJSONAnnotationToInline from '../../../convertJSONAnnotationToInline'

export default async function downloadAnnotationFile(
  e,
  data,
  format,
  eventEmitter
) {
  e.preventDefault()
  let downloadPath

  try {
    if (format === 'json') {
      downloadPath = createDownloadPath(data)
    } else if (format === 'inline') {
      const inlineData = await convertJSONAnnotationToInline(data)

      const blob = new Blob([inlineData], { type: 'text/plain' })
      downloadPath = URL.createObjectURL(blob)
    }
  } catch (e) {
    console.error(e)
    return
  }

  const tempLink = document.createElement('a')
  tempLink.setAttribute('href', downloadPath)
  tempLink.setAttribute('download', e.target.previousElementSibling.value)
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)

  eventEmitter.emit('textae-event.resource.annotation.save', data)
}
