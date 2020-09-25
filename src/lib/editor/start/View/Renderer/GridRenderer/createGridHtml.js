import Handlebars from 'handlebars'

// When multiple entities are added, the grid positioning is performed together.
// There is a time difference between drawing and setting the position of the grid.
// When a new entity is added, the added grid is momentarily displayed at the end of the editor.
// To prevent this, the grid is hidden when drawing the grid and displayed after the move is completed.
const source = `
  <div id={{id}} class="textae-editor__grid hidden" style="width: {{spanWidth}}px">
  </div>
  `
const template = Handlebars.compile(source)

export default function(spanId, spanWidth) {
  return template({ id: `G${spanId}`, spanWidth })
}
