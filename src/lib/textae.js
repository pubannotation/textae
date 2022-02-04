import alertifyjs from 'alertifyjs'
import Tool from './Tool'
import Editor from './Editor'

const tool = new Tool()

export default function () {
  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  for (const element of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const editor = new Editor(element, tool.nextID)
    // Register an editor
    tool.registerEditor(element, editor)
  }
}
