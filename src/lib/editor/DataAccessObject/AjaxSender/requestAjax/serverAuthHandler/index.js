import LoginInfoDialog from './LoginInfoDialog'
import isSeverAuthRequired from './isSeverAuthRequired'

export default function(ajaxResponse, errorHandler, retryHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    const win = new LoginInfoDialog(location).open()

    // 参考：https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(function() {
      if (win && win.closed) {
        clearInterval(timer)
        retryHandler()
      }
    }, 1000)
  } else {
    errorHandler()
  }
}
