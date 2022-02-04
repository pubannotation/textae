import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const element of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const editorAPI = editorize(element, tool.nextID)
    // Register an editor
    tool.registerEditor(editorAPI, element)
  }
}
