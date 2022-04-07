import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

export default function (ajaxResponse) {
  const location = isServerAuthRequired(ajaxResponse)

  return new Promise((resolve, reject) => {
    if (location) {
      const window = openPopUp(location)
      if (window) {
        // Watching for cross-domain pop-up windows to close.
        // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
        const timer = setInterval(() => {
          if (window.closed) {
            clearInterval(timer)
            resolve()
          }
        }, 1000)
        return
      } else {
        console.log('Cannot open pop-up window.')
      }
    }

    reject()
  })
}
