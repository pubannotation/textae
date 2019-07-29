export default function(contents) {
  const blob = new Blob([contents], {
    type: 'application/json'
  })
  return URL.createObjectURL(blob)
}
