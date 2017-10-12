import Tool from './tool'
import controlBar from './control/controlBar'
import ContextMenu from './control/ContextMenu'
import editor from './editor'
import combine from './combine'
global.jQuery = require("jquery")
require("stickykit")

let tool = new Tool()

jQuery.fn.textae = (function() {
  return function() {
    if (jQuery(this).hasClass("textae-editor")) {
      jQuery(this).each(function() {
        // Create an editor
        let e = jQuery(this)
        editor.apply(e)

        // Register an editor
        tool.registerEditor(e)

        // Start an editor
        e.api.start(e)

        // Combine a controle to an editor
        combine(e, controlBar(), new ContextMenu(e))

        e.find('.textae-control').stick_in_parent()

        return e
      })
    }
  }
})()

jQuery(function($) {
  $(".textae-editor").textae()
})
