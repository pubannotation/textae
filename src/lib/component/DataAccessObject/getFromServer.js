import url from 'url'
import ajaxAccessor from '../../util/ajaxAccessor'
import jQuerySugar from '../jQuerySugar'
import toastr from 'toastr'

export default function(urlForJson, beforeSend, successHandler, finishHandler) {
  beforeSend()

  ajaxAccessor(
    urlForJson,
    (loadData) => {
      successHandler({
        source: jQuerySugar.toLink(url.resolve(location.href, urlForJson)),
        loadData
      })
      finishHandler()
    },
    () => {
      finishHandler()
      toastr.error('Could not load the target.')
    }
  )
}
