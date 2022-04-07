import openPopUp from './openPopUp'

export default function (location) {
  console.assert(location, 'loocation is necessary!')
  const window = openPopUp(location)

  return new Promise((resolve, reject) => {
    if (!window) {
      console.log('Cannot open pop-up window.')
      return reject()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(() => {
      if (window.closed) {
        clearInterval(timer)
        resolve()
      }
    }, 1000)
  })
}
