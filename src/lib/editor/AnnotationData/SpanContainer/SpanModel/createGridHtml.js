export default function (spanId, top, left, width) {
  const id = `G${spanId}`
  const style = `top: ${top}px; left: ${left}px; width: ${width}px;`

  return `
  <div id=${id} class="textae-editor__grid" style="${style}">
  </div>
  `
}
