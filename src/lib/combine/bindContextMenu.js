export default function (editor, contextMenu) {
  // add context menu
  editor[0].appendChild(contextMenu.el)
  editor.eventEmitter
    .on('textae.control.button.push', (data) =>
      contextMenu.updateButtonPushState(data.buttonName, data.state)
    )
    .on('textae.control.buttons.change', (enableButtons) =>
      contextMenu.updateAllButtonEnableState(enableButtons)
    )
    .on('textae.editor.key.input', () => contextMenu.hide())

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

  window.addEventListener('contextmenu', (e) => {
    // Close ContextMenu when another editor is clicked.
    contextMenu.hide()

    // If the editor you click on is selected and editable,
    // it will display its own context menu, rather than the browser's context menu.
    const clickedEditor = e.target.closest('.textae-editor')
    if (clickedEditor === editor[0]) {
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
      e.preventDefault()

      // The context menu is `position:absolute` in the editor.
      // I want the coordinates where you right-click with the mouse, starting from the upper left of the editor.
      // So the Y coordinate is pageY minus the editor's offsetTop.
      contextMenu.show(e.pageY - editor[0].offsetTop, e.pageX)
    }
  })
}
