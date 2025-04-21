import createDownloadPathForFormat from './createDownloadPathForFormat'

export default function viewSource(data, format, eventEmitter) {
  const downloadPath = createDownloadPathForFormat(data, format)
  window.open(downloadPath, '_blank')

  eventEmitter.emit('textae-event.resource.annotation.save', data)
}
