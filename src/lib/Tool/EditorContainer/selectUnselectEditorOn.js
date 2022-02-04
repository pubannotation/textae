/**
 *
 * @param {import('.').default} editorContainer
 */
export default function (editorContainer) {
  // The blur events always occurs each focus changing.
  // For example, blur events always occurs when the labels in the pallet is clicked.
  // If other editors are selected, the pallet should be closed.
  // But the blur events is not distinguished from clicking on the pallet and selection other editors.

  // Select the editor when the editor, a span or an entity-type is focused in.
  // Unselect the editor when a child element of other than the editor is focused in.
  // The click events are not fired on changing the selection by the tab key.
  document.body.addEventListener(
    'focus',
    (e) => {
      const element = e.target.closest('.textae-editor')

      if (element) {
        if (editorContainer.selected && editorContainer.selected !== element) {
          editorContainer.unselect(editorContainer.selected)
        }
        editorContainer.selected = element
      }
    },
    true
  )

  // Unselect the editor when a child element of other than the editor is clicked.
  // The focus events are not fired on the un-focusable elements like div.
  document.body.addEventListener('click', (e) => {
    // Ignore clicks on the jQuery UI dialogs.
    if (e.target.closest('.textae-editor__dialog') !== null) {
      return
    }

    // Ignore clicks on the auto-completion items.
    if (e.target.closest('.ui-autocomplete') !== null) {
      return
    }

    // Ignore clicks on the overlay of the jQuery UI.
    if (e.target.closest('.ui-widget-overlay') !== null) {
      return
    }

    // Ignore clicks on the pallet.
    if (e.target.closest('.textae-editor__pallet__content') !== null) {
      return
    }

    // Ignore clicks on children of the this Editor
    if (editorContainer.has(e.target.closest('.textae-editor'))) {
      return
    }

    if (editorContainer.selected) {
      editorContainer.unselect(editorContainer.selected)
    }
  })
}
