import Tool from './tool'
import control from './control'
import editor from './editor'

let tool = new Tool()

jQuery.fn.textae = (function() {
  return function() {
    if (this.hasClass("textae-editor")) {
      this.each(function() {
        var e = $(this)
        tool.pushEditor(e)
        editor.apply(e)
        e.api.start(e)
        return e
      })
      tool.disableAllButtons()
    } else if (this.hasClass("textae-control")) {
      var c = control(this)
      tool.setControl(c)
      return c
    }
  }
})()
