import Tool from './tool'
import control from './control'
import editor from './editor'
import combine from './combine'

let tool = new Tool()

jQuery.fn.textae = (function() {
  return function() {
    if (this.hasClass("textae-editor")) {
      this.each(function() {
        // Create an editor
        var e = $(this)
        editor.apply(e)

        // Register an editor
        tool.registerEditor(e)

        // Start an editor
        e.api.start(e)

        // Combine a controle to an editor
        combine(e, control())

        return e
      })
    }
  }
})()
