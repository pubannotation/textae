import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const self of document.querySelectorAll('.textae-editor')) {
    const $this = $(self)
    // Register an editor
    $this.editorID = tool.registerEditor($this)
    // Create an editor
    editorize($this)
  }
}
