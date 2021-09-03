import $ from 'jquery'
import Tool from './Tool'
import editorize from './editorize'

const tool = new Tool()

export default function () {
  for (const self of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const $e = $(self)
    editorize($e)
    // Register an editor
    tool.registerEditor($e)
    // Start an editor
    $e.start($e)
  }
}
