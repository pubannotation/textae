import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

export default function (ajaxResponse, errorHandler, retryHandler) {
  const location = isServerAuthRequired(ajaxResponse)

  if (location) {
    const window = openPopUp(location)
    if (window) {
      // Watching for cross-domain pop-up windows to close.
      // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
      const timer = setInterval(() => {
        if (window.closed) {
          clearInterval(timer)
          retryHandler()
        }
      }, 1000)
      return
    }
  }

  errorHandler()
}
