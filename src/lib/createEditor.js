import Editor from './Editor'

export default function createEditor(element, tool) {
  return new Editor(
    element,
    tool.nextID,
    tool.mousePoint,
    () => {
      // jQuery Ui dialogs are not in the editor.
      for (const dialog of document.querySelectorAll('.ui-dialog')) {
        dialog.classList.add('textae-editor--wait')
      }
      for (const dialog of document.querySelectorAll('.ui-widget-overlay')) {
        dialog.classList.add('textae-editor--wait')
      }
    },
    () => {
      for (const dialog of document.querySelectorAll('.ui-dialog')) {
        dialog.classList.remove('textae-editor--wait')
      }
      for (const dialog of document.querySelectorAll('.ui-widget-overlay')) {
        dialog.classList.remove('textae-editor--wait')
      }
    }
  )
}
