import url from 'url'
import ajaxAccessor from '../../util/ajaxAccessor'
import alertifyjs from 'alertifyjs'

export default function(urlForJson, beforeSend, successHandler, finishHandler) {
  beforeSend()

  ajaxAccessor(
    urlForJson,
    (loadData) => {
      const uri = url.resolve(location.href, urlForJson)

      successHandler({
        source: `<a class="textae-editor__footer__message__link" href="${uri}">${decodeURI(
          uri
        )}</a>`,
        loadData
      })

      finishHandler()
    },
    () => {
      finishHandler()
      alertifyjs.error('Could not load the target.')
    }
  )
}
