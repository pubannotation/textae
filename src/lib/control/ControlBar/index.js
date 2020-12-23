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
  ${buttonGroup
    .map(
      ({ list }) => `
  <span class="textae-control__separator"></span>
    ${list
      .map(
        ({ type, title }) => `
  <span 
    class="textae-control__icon textae-control__${type}-button" 
    title="${title}" 
    data-button-type="${type}">
  </span>
  `
      )
      .join('\n')}
  `
    )
    .join('\n')}
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
