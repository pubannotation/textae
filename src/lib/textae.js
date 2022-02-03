import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const self of document.querySelectorAll('.textae-editor')) {
    const $this = $(self)
    // Register an editor
    tool.registerEditor($this)
    // Create an editor
    const $e = editorize($this)
    // Start an editor
    $e.start($e)
  }
}
