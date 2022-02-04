import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const element of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const $this = $(element)
    $this.editorID = tool.nextID
    editorize($this)
    // Register an editor
    tool.registerEditor($this, element)
  }
}
