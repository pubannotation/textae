export default function (editorHTMLElement, contextMenu) {
  // Close ContextMenu when another editor is clicked
  window.addEventListener('click', (e) => {
    // In Firefox, the right button of mouse fires a 'click' event.
    // https://stackoverflow.com/questions/43144995/mouse-right-click-on-firefox-triggers-click-event
    // In Fireforx, MoesueEvent has a 'which' property, which is 3 when the right button is clicked.
    // https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
    if (e.which === 3) {
      return
    }

    contextMenu.hide()
  })

  window.addEventListener('contextmenu', (contextmenuEvent) => {
    // Close ContextMenu when another editor is clicked.
    contextMenu.hide()

    // If the editor you click on is selected and editable,
    // it will display its own context menu, rather than the browser's context menu.
    const clickedEditor = contextmenuEvent.target.closest('.textae-editor')
    if (clickedEditor === editorHTMLElement) {
      if (
        clickedEditor.classList.contains(
          'textae-editor__mode--view-with-relation'
        ) ||
        clickedEditor.classList.contains(
          'textae-editor__mode--view-without-relation'
        )
      ) {
        return
      }

      // Prevent show browser default context menu
      contextmenuEvent.preventDefault()
      contextMenu.show(contextmenuEvent)
    }
  })
}
