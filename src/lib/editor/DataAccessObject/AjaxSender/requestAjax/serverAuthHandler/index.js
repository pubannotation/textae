import LoginInfoDialog from './LoginInfoDialog'
import isSeverAuthRequired from './isSeverAuthRequired'

export default function(ajaxResponse, errorHandler, retryHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    const win = new LoginInfoDialog(location).open()

    const timer = setInterval(function() {
      if (win.closed) {
        clearInterval(timer)
        retryHandler()
      }
    }, 1000)
  } else {
    errorHandler()
  }
}
