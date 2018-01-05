import * as ajaxAccessor from '../../util/ajaxAccessor'

export default function(url, jsonData, showSaveSuccess, showSaveError, cursorChanger) {
  cursorChanger.startWait()
  let endWait = () => {
      cursorChanger.endWait()
    },
    retryByPost = () => {
      cursorChanger.startWait()
      ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, endWait)
    }

  // textae-config service is build with the Ruby on Rails 4.X.
  // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
  ajaxAccessor.patch(url, jsonData, showSaveSuccess, retryByPost, endWait)
}
