import url from 'url'

export default function(sourceType, source) {
  switch (sourceType) {
    case 'url': {
      const uri = url.resolve(location.href, source)
      return `<a class="textae-editor__footer__message__link" href="${uri}">${decodeURI(
        uri
      )}</a>`
    }
    case 'local file':
      return `${source}(local file)`
    default:
      throw `unknown source type: ${sourceType}.`
  }
}
