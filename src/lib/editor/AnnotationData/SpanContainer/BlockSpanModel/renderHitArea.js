export default function (parentElement, span, hitAreaId) {
  const div = document.createElement('div')
  div.setAttribute('class', hitAreaId)
  div.setAttribute('title', span.id)
  div.classList.add('textae-editor__block-hit-area')

  // Keeps the ID of the span to determine which span was clicked when clicked.
  div.dataset.id = span.id

  // Place the hit area in the annotation box
  // to shift the hit area up by half a line from the block span area.
  parentElement.appendChild(div)
}
