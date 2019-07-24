import jQueryEnabled from './jQueryEnabled'
import $ from 'jquery'
import setProp from './setProp'

export default {
  enabled: jQueryEnabled,
  Div(className) {
    return $('<div>').addClass(className)
  },
  P(className, text) {
    return $('<p>')
      .addClass(className)
      .text(text)
  },
  Label(className, text) {
    return $('<label>')
      .addClass(className)
      .text(text)
  },
  Button(label, className) {
    return $('<input type="button" disabled="disabled" />')
      .addClass(className)
      .val(label)
  },
  Checkbox(className) {
    return $('<input type="checkbox"/>').addClass(className)
  },
  Number(className) {
    return $('<input type="number"/>').addClass(className)
  },
  toLink(url) {
    return `<a href="${url}">${url}</a>`
  },
  getValueFromText($target, className) {
    return $target.find(`[type="text"].${className}`).val()
  },
  setChecked($target, className, value) {
    setProp('checked', $target, className, value)
  },
  setValue($target, className, value) {
    setProp('value', $target, className, value)
  }
}
