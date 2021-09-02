import delegate from 'delegate'

export default function (editor) {
  const dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of an entity by the double-click.
  delegate(dom, '.textae-editor__signboard', 'mousedown', (e) =>
    e.preventDefault()
  )
}
