import Handlebars from 'handlebars'

const source = `
  <div id={{id}} class="textae-editor__grid hidden" style="width: {{spanWidth}}px">
  </div>
  `
const template = Handlebars.compile(source)

export default function(spanId, spanWidth) {
  return template({ id: `G${spanId}`, spanWidth })
}
