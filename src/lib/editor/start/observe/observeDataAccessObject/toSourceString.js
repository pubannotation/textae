export default function (sourceType, source) {
  switch (sourceType) {
    case 'url': {
      return new URL(source, location.href).href
    }
    case 'local file':
      return `${source}(local file)`
    default:
      throw `unknown source type: ${sourceType}.`
  }
}
