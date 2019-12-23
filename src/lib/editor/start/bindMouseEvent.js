import delegate from 'delegate'

export default function(editor, view) {
  const dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Trigger body click event
  // The blank area on the editor is textae-editor__body__text-box or textae-editor__body__text-box__paragraph-margin.
  delegate(dom, '.textae-editor__body__text-box', 'click', (e) => {
    // The delegate also fires events for child elements of the selector.
    // Ignores events that occur in child elements.
    // Otherwise, you cannot select child elements.
    if (
      e.target.classList.contains('textae-editor__body__text-box') ||
      e.target.classList.contains(
        'textae-editor__body__text-box__paragraph-margin'
      )
    ) {
      editor.eventEmitter.emit('textae.editor.body.click')
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
