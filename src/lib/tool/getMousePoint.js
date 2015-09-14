// Ovserve and record mouse position to return it.
let lastMousePoint = {}

document
  .querySelector('html')
  .addEventListener('mousemove', (e) => {
    lastMousePoint.top = e.clientY
    lastMousePoint.left = e.clientX
  })

export default function() {
  return lastMousePoint
}
