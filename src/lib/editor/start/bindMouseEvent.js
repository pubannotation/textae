import delegate from 'delegate'

export default function(editor, view) {
  const dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of a type by the double-click.
  delegate(dom, '.textae-editor__type', 'mousedown', (e) => e.preventDefault())

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity', 'mouseover', (e) =>
    view.hoverRelation.on(e.target.title)
  )
  delegate(dom, '.textae-editor__entity', 'mouseout', (e) =>
    view.hoverRelation.off(e.target.title)
  )
}
