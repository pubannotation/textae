export default async function (file) {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => resolve(event)
    reader.readAsText(file)
  })
}
