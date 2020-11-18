export default function (parentElement, span) {
  const div = document.createElement('div')
  div.setAttribute('id', span.backgroundId)
  div.classList.add('textae-editor__block-bg')
  div.dataset.id = span.id

  parentElement.appendChild(div)
}
