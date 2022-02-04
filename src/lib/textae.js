import Tool from './Tool'
import Editor from './Editor'

const tool = new Tool()

export default function () {
  for (const element of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const editorAPI = new Editor(element, tool.nextID)
    // Register an editor
    tool.registerEditor(element, editorAPI)
  }
}
