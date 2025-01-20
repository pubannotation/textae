// Watching for cross-domain pop-up windows to close.
// https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128

export default async function (window) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (window.closed) {
        clearInterval(timer)
        resolve()
      }
    }, 1000)
  })
}
