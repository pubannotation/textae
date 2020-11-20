import Handlebars from 'handlebars'

const source = `
  <div id={{id}} class="textae-editor__grid" style="{{style}}">
  </div>
  `
const template = Handlebars.compile(source)

export default function (spanId, top, left, width) {
  return template({
    id: `G${spanId}`,
    style: `top: ${top}px; left: ${left}px; width: ${width}px;`
  })
}
