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
  <div class="textae-control-summary">
    <span class="textae-control-title">
      <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    <button type="button" class="textae-control-humburger-menu-button" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
      </svg>
    </button>
  </div>
  <div class="textae-control-details">
    <span class="textae-control-title">
      <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    ${buttonGroup.map(toButtonGroup()).join('\n')}
  </div>
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
