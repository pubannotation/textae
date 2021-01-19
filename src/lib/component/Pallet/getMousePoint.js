// Ovserve and record mouse position to return it.
const lastMousePoint = {}

document.querySelector('html').addEventListener('mousemove', (e) => {
  lastMousePoint.clientY = e.clientY
  lastMousePoint.left = e.clientX
})

export default function () {
  return lastMousePoint
}
