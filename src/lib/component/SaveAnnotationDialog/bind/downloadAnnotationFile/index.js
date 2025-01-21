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

    // Using an existing <a> tag to following process, it cause the click event to fire twice, resulting an error.
    // Creating and using a temporary link (tempLink) prevents the re-triggering event.
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
