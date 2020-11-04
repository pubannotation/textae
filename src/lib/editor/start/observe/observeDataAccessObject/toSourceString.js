import url from 'url'

export default function (sourceType, source) {
  switch (sourceType) {
    case 'url': {
      return url.resolve(location.href, source)
    }
    case 'local file':
      return `${source}(local file)`
    default:
      throw `unknown source type: ${sourceType}.`
  }
}
