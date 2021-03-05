export default function (spanId, top, left, width) {
  return `
<div 
  id=G${spanId} 
  class="textae-editor__grid" 
  style="top: ${top}px; left: ${left}px; width: ${width}px;">
</div>
`
}
