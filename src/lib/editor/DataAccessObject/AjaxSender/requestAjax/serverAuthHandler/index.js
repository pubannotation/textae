import isSeverAuthRequired from './isSeverAuthRequired'
import openPopUp from './openPopUp'

export default function (ajaxResponse, errorHandler, retryHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    const win = openPopUp(location)
    if (win) {
      // Watching for cross-domain pop-up windows to close.
      // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer)
          retryHandler()
        }
      }, 1000)
    } else {
      errorHandler()
    }
  } else {
    errorHandler()
  }
}
