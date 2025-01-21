// Using an existing <a> tag to following process, it cause the click event to fire twice, resulting an error.
// Creating and using a temporary link (tempLink) prevents the re-triggering event.

export default function downloadAnnotation(downloadPath, fileName) {
  const tempLink = document.createElement('a')
  tempLink.setAttribute('href', downloadPath)
  tempLink.setAttribute('download', fileName)
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
}
