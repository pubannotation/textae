export default function(editor, presenter, view) {
  editor
    .on('mousedown', (e) => {
      if (e.shiftKey) {
        return false
      }
    })
    // Prevent a selection of a type by the double-click.
    .on('mousedown', '.textae-editor__type', () => false)
    .on('mousedown', '.textae-editor__body__text-box__paragraph-margin', (e) => {
      // Prevent a selection of a margin of a paragraph by the double-click.
      if (e.target.className === 'textae-editor__body__text-box__paragraph-margin')
        return false
    })
    .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', presenter.event.editorSelected)
    .on('mouseenter', '.textae-editor__entity', (e) => view.hoverRelation.on($(e.target).attr('title')))
    .on('mouseleave', '.textae-editor__entity', (e) => view.hoverRelation.off($(e.target).attr('title')))
}
