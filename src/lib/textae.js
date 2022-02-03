import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const self of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const $this = $(self)
    $this.editorID = tool.nextID
    editorize($this)
    // Register an editor
    tool.registerEditor($this)
  }
}
