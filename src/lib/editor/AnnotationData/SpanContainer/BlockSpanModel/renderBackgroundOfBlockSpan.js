export default function (parentElement, span) {
  const div = document.createElement('div')
  div.setAttribute('id', span.backgroundId)
  div.classList.add('textae-editor__block-bg')

  // Always add to the top of the annotation box to place it behind the grid.
  parentElement.insertAdjacentElement('afterbegin', div)
}
