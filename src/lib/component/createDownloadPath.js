export default function (dataObject) {
  const blob = new Blob([JSON.stringify(dataObject)], {
    type: 'application/json'
  })

  return URL.createObjectURL(blob)
}
