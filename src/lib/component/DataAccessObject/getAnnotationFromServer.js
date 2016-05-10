import url from 'url'
import * as ajaxAccessor from '../../util/ajaxAccessor'
import jQuerySugar from '../jQuerySugar'

module.exports = function(urlToJson, cursorChanger, api, setDataSourceUrl) {
  cursorChanger.startWait()
  ajaxAccessor.getAsync(urlToJson, function getAnnotationFromServerSuccess(annotation) {
    cursorChanger.endWait()
    api.emit('load', {
      annotation: annotation,
      source: jQuerySugar.toLink(url.resolve(location.href, urlToJson))
    })
    setDataSourceUrl(urlToJson)
  }, function() {
    cursorChanger.endWait()
    toastr.error("Could not load the target.")
  })
}
