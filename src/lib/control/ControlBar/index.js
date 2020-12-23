import Control from '../Control'
import transitWriteButtonImage from './transitWriteButtonImage'

// Make a group of buttons that is headed by the separator.
function template(context) {
  const { buttonGroup } = context
  return `
<div class="textae-control textae-control-bar">
  <span class="textae-control__title">
    <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
  </span>
  ${buttonGroup.map(toButtonGroup()).join('\n')}
</div>
`
}

// The control is a control bar in an editor.
export default class ControlBar extends Control {
  constructor(editor) {
    super(template, editor)
  }

  transitWriteButtonImage(transitButtons) {
    transitWriteButtonImage(super.el, transitButtons)
  }
}

function toButtonGroup() {
  return ({ list }) => `
  <span class="textae-control__separator"></span>
  ${list.map(toButtonIcon).join('\n')}
  `
}

function toButtonIcon({ type, title }) {
  return `
<span 
class="textae-control__icon textae-control__${type}-button" 
title="${title}" 
data-button-type="${type}">
</span>
`
}
