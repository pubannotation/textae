import url from 'url'
import ajaxAccessor from '../../util/ajaxAccessor'
import alertifyjs from 'alertifyjs'

export default function(urlForJson, done, cursorChanger) {
  cursorChanger.startWait()

  ajaxAccessor(
    urlForJson,
    (loadData) => {
      const uri = url.resolve(location.href, urlForJson)

      done(
        `<a class="textae-editor__footer__message__link" href="${uri}">${decodeURI(
          uri
        )}</a>`,
        loadData
      )

      cursorChanger.endWait()
    },
    () => {
      cursorChanger.endWait()
      alertifyjs.error('Could not load the target.')
    }
  )
}
