import createDownloadPathByFormat from './createDownloadPathByFormat'

export default async function downloadAnnotationFile(
  e,
  data,
  format,
  eventEmitter
) {
  e.preventDefault()

  try {
    const downloadPath = await createDownloadPathByFormat(data, format)

    const tempLink = document.createElement('a')
    tempLink.setAttribute('href', downloadPath)
    tempLink.setAttribute('download', e.target.previousElementSibling.value)
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)

    eventEmitter.emit('textae-event.resource.annotation.save', data)
  } catch (e) {
    console.error(e)
    return
  }
}
