import jQueryEnabled from './jQueryEnabled'
import $ from 'jquery'
import _ from 'underscore'

var setProp = function(key, $target, className, value) {
  var valueObject = {}

  valueObject[key] = value
  return $target
    .find(className)
    .prop(valueObject)
    .end()
}

module.exports = {
  enabled: jQueryEnabled,
  Div: function(className) {
    return $('<div>').addClass(className)
  },
  P: function(className, text) {
    return $('<p>')
      .addClass(className)
      .text(text)
  },
  Label: function(className, text) {
    return $('<label>')
      .addClass(className)
      .text(text)
  },
  Button: function(label, className) {
    return $('<input type="button" disabled="disabled" />')
      .addClass(className)
      .val(label)
  },
  Checkbox: function(className) {
    return $('<input type="checkbox"/>').addClass(className)
  },
  Number: function(className) {
    return $('<input type="number"/>').addClass(className)
  },
  toLink: function(url) {
    return '<a href="' + url + '">' + url + '</a>'
  },
  getValueFromText: function($target, className) {
    return $target.find('[type="text"].' + className).val()
  },
  setChecked: _.partial(setProp, 'checked'),
  setValue: _.partial(setProp, 'value')
}
