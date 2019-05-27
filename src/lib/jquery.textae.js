import Tool from './tool'
import controlBar from './control/controlBar'
import ContextMenu from './control/ContextMenu'
import editor from './editor'
import combine from './combine'
const tJQ = require("jquery")
require("sticky-kit")

const textaeQuery = tJQ.noConflict(true)
let tool = new Tool()

textaeQuery.fn.textae = (function() {
  return function() {
    if (textaeQuery(this).hasClass("textae-editor")) {
      textaeQuery(this).each(function() {
        // Create an editor
        let e = textaeQuery(this)
        editor.apply(e)

        // Register an editor
        tool.registerEditor(e)

        // Start an editor
        e.api.start(e)

        // Combine a controle to an editor
        combine(e, controlBar(), new ContextMenu(e))

        e.find('.textae-control-bar').stick_in_parent()

        return e
      })
    }
  }
})()

document.addEventListener("DOMContentLoaded", function(event) {
  textaeQuery(".textae-editor").textae()
})
$.noConflict(true)
