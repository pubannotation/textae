import delegate from 'delegate'

export default function(editor, presenter, view) {
  let dom = editor[0]

  // Prevent a selection text with shift keies.
  dom.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      e.preventDefault()
    }
  })

  // Prevent a selection of a type by the double-click.
  delegate(dom, '.textae-editor__type', 'mousedown', (e) => e.preventDefault())

  // Prevent a selection of a margin of a paragraph by the double-click.
  delegate(dom, '.textae-editor__body__text-box__paragraph-margin', 'mousedown', (e) => {
    // Filter bubbling event from children.
    // if (e.target.className === 'textae-editor__body__text-box__paragraph-margin')
    // e.preventDefault()
  })

  // Select the editor when the editor, a span or an entity-type is focused in.
  // Unselect the editor when a child element of other than the editor is focused in.
  // The blur events always occurs each focus changing.
  // For example, blur events always occurs when the labels in the pallt is clicked.
  // If other editors are selected, the pallet should be closed.
  // But the blur events is not distinguished from clicking on the parret and selection other editors.
  document.body.addEventListener('focus', (e) => {
    if (e.target.closest('.textae-editor') === dom) {
      presenter.event.editorSelected()
    } else {
      presenter.event.editorUnselected()
    }
  }, true)

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity', 'mouseover', (e) => view.hoverRelation.on(e.target.title))
  delegate(dom, '.textae-editor__entity', 'mouseout', (e) => view.hoverRelation.off(e.target.title))
}
