export default function (url) {
  const width = 600
  const height = 500

  return window.open(url, '_blank', `width=${width}, height=${height}`)
}
