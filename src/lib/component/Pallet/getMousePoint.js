// Observe and record mouse position to return it.
const lastMousePoint = {}

document.querySelector('html').addEventListener('mousemove', (e) => {
  lastMousePoint.clientY = e.clientY
  lastMousePoint.pageY = e.pageY
  lastMousePoint.clientX = e.clientX
})

export default function () {
  return lastMousePoint
}
