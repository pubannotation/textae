import delegate from 'delegate'

export default function (element) {
  // Prevent a selection text with shift keies.
  element.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of an entity by the double-click.
  delegate(element, '.textae-editor__signboard', 'mousedown', (e) =>
    e.preventDefault()
  )
}
