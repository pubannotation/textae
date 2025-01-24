import createDownloadPathForFormat from '../createDownloadPathForFormat'
import downloadAnnotation from './downloadAnnotation'

export default async function downloadAnnotationFile(
  e,
  data,
  format,
  eventEmitter
) {
  e.preventDefault()

  const downloadPath = await createDownloadPathForFormat(data, format)
  downloadAnnotation(downloadPath, e.target.previousElementSibling.value)

  eventEmitter.emit('textae-event.resource.annotation.save', data)
}
