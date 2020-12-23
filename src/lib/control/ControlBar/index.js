import Control from '../Control'
import toButtonGroup from './toButtonGroup'
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
