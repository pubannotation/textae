import delegate from 'delegate'

export default function(editor, presenter, view) {
  const dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of a type by the double-click.
  delegate(dom, '.textae-editor__type', 'mousedown', (e) => e.preventDefault())

  // Prevent a selection of a margin of a paragraph by the double-click.
  delegate(
    dom,
    '.textae-editor__body__text-box__paragraph-margin',
    'mousedown',
    (e) => {
      // Filter bubbling event from children.
      // if (e.target.className === 'textae-editor__body__text-box__paragraph-margin')
      // e.preventDefault()
    }
  )

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity', 'mouseover', (e) =>
    view.hoverRelation.on(e.target.title)
  )
  delegate(dom, '.textae-editor__entity', 'mouseout', (e) =>
    view.hoverRelation.off(e.target.title)
  )
}
