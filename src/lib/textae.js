import $ from 'jquery'
import Tool from './tool'
import controlBar from './control/controlBar'
import ContextMenu from './control/ContextMenu'
import editor from './editor'
import combine from './combine'

const tool = new Tool()

export default function() {
  for (const self of document.querySelectorAll('.textae-editor')) {
    // Create an editor
    const e = $(self)
    editor.call(e)
    // Register an editor
    tool.registerEditor(e)
    // Start an editor
    e.api.start(e)
    // Combine a controle to an editor
    combine(e, controlBar(), new ContextMenu(e))
  }
}
