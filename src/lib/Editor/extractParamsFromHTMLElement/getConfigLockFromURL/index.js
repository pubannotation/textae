export default function (source) {
  if (source) {
    const searchParams = new URLSearchParams(source.split('?')[1])

    if (searchParams.has('config_lock')) {
      return searchParams.get('config_lock')
    }
  }
  return null
}
