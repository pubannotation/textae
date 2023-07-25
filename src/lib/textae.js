import alertifyjs from 'alertifyjs'
import Tool from './Tool'
import createEditor from './createEditor'

const tool = new Tool()

export default function () {
  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  return Array.from(document.querySelectorAll('.textae-editor'))
    .filter((element) => !element.dataset.textaeInitialized)
    .map((element) => {
      // Create an editor
      const editor = createEditor(element, tool)
      // Register an editor
      tool.registerEditor(element, editor)

      // Mark as initiated.
      element.dataset.textaeInitialized = true

      return editor
    })
    .map((editor) => ({
      // We plan to add information here that we would like to make available to the outside world.
      set annotation(annotation) {
        editor.load(annotation)
      }
    }))
}
