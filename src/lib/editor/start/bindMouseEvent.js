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

  // Select the editor when body, span, grid or entity is clicked.
  // delegate(dom, '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', 'mouseup', presenter.event.editorSelected)

  // Unselect the editor when the editro focus outed.
  // function hoge(message, e) {
  //   console.log(message, e, document.activeElement)
  // }
  dom.addEventListener('focus', presenter.event.editorSelected, true)
  dom.addEventListener('blur', presenter.event.editorUnselected, true)


  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity', 'mouseover', (e) => view.hoverRelation.on(e.target.title))
  delegate(dom, '.textae-editor__entity', 'mouseout', (e) => view.hoverRelation.off(e.target.title))
}
