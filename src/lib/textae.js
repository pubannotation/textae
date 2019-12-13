import $ from 'jquery'
import Tool from './tool'
import ControlBar from './control/ControlBar'
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
    combine(
      e,
      new ControlBar(e.eventEmitter),
      new ContextMenu(e, e.eventEmitter)
    )
  }
}
