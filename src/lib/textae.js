import alertifyjs from 'alertifyjs'
import Tool from './Tool'
import Editor from './Editor'

const tool = new Tool()

export default function () {
  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  Array.from(document.querySelectorAll('.textae-editor'))
    .filter((element) => !element.dataset.textaeInitialized)
    .forEach((element) => {
      // Create an editor
      const editor = new Editor(
        element,
        tool.nextID,
        () => {
          // jQuery Ui dialogs are not in the editor.
          for (const dialog of document.querySelectorAll('.ui-dialog')) {
            dialog.classList.add('textae-editor--wait')
          }
          for (const dialog of document.querySelectorAll(
            '.ui-widget-overlay'
          )) {
            dialog.classList.add('textae-editor--wait')
          }
        },
        () => {
          for (const dialog of document.querySelectorAll('.ui-dialog')) {
            dialog.classList.remove('textae-editor--wait')
          }
          for (const dialog of document.querySelectorAll(
            '.ui-widget-overlay'
          )) {
            dialog.classList.remove('textae-editor--wait')
          }
        }
      )
      // Register an editor
      tool.registerEditor(element, editor)

      // Mark as initiated.
      element.dataset.textaeInitialized = true
    })
}
