import * as ajaxAccessor from '../../util/ajaxAccessor'
import cookieHandler from '../../util/CookieHandler'
import loginInfoDialog from '../LoginInfoDialog'
import openPopUp from './openPopUp'

export default function(
  url,
  jsonData,
  showSaveSuccess,
  showSaveError,
  cursorChanger,
  editor
) {
  cursorChanger.startWait()
  const endWait = () => {
    cursorChanger.endWait()
  }
  const retryByPost = () => {
    cursorChanger.startWait()
    ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, endWait)
  }
  const handleCustomHeader = (ajaxResponse) => {
    // When save failed, analyze the response code and headers.
    // If the response follows the followings format, will open 'login-page-url' in a new popup window.
    // ==============================================================
    // 401 Unauthorized
    // WWW-Authenticate: ServerPage
    // Location: login-page-url
    // ==============================================================
    //
    // ※ Server must returns "Access-Control-Expose-Headers". Because client scripts cannot read the headers
    //  except for 'simple response header' when your requests are CORS.
    // ==============================================================
    // Access-Control-Expose-Headers: WWW-Authenticate,Location
    // ==============================================================
    const statusCode = ajaxResponse.status
    const wwwAuthenticateHeader = ajaxResponse.getResponseHeader(
      'WWW-Authenticate'
    )
    const locationHeader = ajaxResponse.getResponseHeader('Location')

    if (
      statusCode === 401 &&
      wwwAuthenticateHeader &&
      wwwAuthenticateHeader === 'ServerPage' &&
      locationHeader
    ) {
      const isHideMessageBox = cookieHandler().get('hide-message-box')
      if (isHideMessageBox === '' || isHideMessageBox === 'false') {
        const dialog = loginInfoDialog(editor, locationHeader)
        dialog.open()
      } else {
        openPopUp(locationHeader)
      }
    } else {
      retryByPost()
    }
  }

  // textae-config service is build with the Ruby on Rails 4.X.
  // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
  ajaxAccessor.patch(
    url,
    jsonData,
    showSaveSuccess,
    handleCustomHeader,
    endWait
  )
}
