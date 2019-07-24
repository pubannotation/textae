import jQueryEnabled from './jQueryEnabled'
import $ from 'jquery'
import _ from 'underscore'

const setProp = function(key, $target, className, value) {
  const valueObject = {}

  valueObject[key] = value
  return $target
    .find(className)
    .prop(valueObject)
    .end()
}

module.exports = {
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
  setChecked: _.partial(setProp, 'checked'),
  setValue: _.partial(setProp, 'value')
}
