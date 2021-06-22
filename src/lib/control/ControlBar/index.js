import Control from '../Control'
import isTouchDevice from '../isTouchDevice'
import toButtonGroup from './toButtonGroup'
import transitWriteButtonImage from './transitWriteButtonImage'
import buttonConfig from '../../buttonConfig'

function template(context) {
  const { buttonGroup } = context
  return `
<div class="textae-control ${
    isTouchDevice() ? 'textae-touch-bar' : 'textae-control-bar'
  }">
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
    super(editor, template(buttonConfig.controlBar))
  }

  transitWriteButtonImage(transitButtons) {
    transitWriteButtonImage(super.el, transitButtons)
  }
}
