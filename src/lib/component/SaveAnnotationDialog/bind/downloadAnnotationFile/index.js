import createDownloadPathByFormat from './createDownloadPathByFormat'
import downloadAnnotation from './downloadAnnotation'

export default async function downloadAnnotationFile(
  e,
  data,
  format,
  eventEmitter
) {
  e.preventDefault()

  try {
    const downloadPath = await createDownloadPathByFormat(data, format)
    downloadAnnotation(downloadPath, e.target.previousElementSibling.value)

    eventEmitter.emit('textae-event.resource.annotation.save', data)
  } catch (e) {
    console.error(e)
    return
  }
}
