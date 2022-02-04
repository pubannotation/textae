import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const element of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const $this = $(element)
    editorize($this, tool.nextID)
    // Register an editor
    tool.registerEditor($this, element)
  }
}
