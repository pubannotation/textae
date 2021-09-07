import Control from '../Control'
import isTouchDevice from '../../isTouchDevice'
import toButtonGroup from './toButtonGroup'
import Sticky from 'sticky-js'

function template(context) {
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
    ${context.map(toButtonGroup()).join('\n')}
  </div>
</div>
`
}

// The control is a control bar in an editor.
export default class ControlBar extends Control {
  constructor(editor, buttonController) {
    super(
      editor,
      template(
        buttonController.controlBarButton.map((list) => {
          const ret = []
          for (const { type, title, pushed, disabled, transit } of list) {
            const classList = [
              'textae-control-icon',
              `textae-control-${type}-button`
            ]
            if (pushed) {
              classList.push('textae-control-icon--pushed')
            }
            if (disabled) {
              classList.push('textae-control-icon--disabled')
            }
            if (transit) {
              classList.push('textae-control-icon--transit')
            }

            ret.push({ type, title, classList })
          }

          return ret
        })
      )
    )

    this._buttonController = buttonController

    // If you use position: sticky,
    // the height of the toolbar will affect the Y coordinate of the textae-body
    // when the browser is not scrolling.
    // When the height of the toolbar is changed using the hamburger menu button,
    // the position of the textae-body will be raised or lowered.
    // When the browser is scrolling,
    // the position of the textae-body is not affected by the height of the toolbar,
    // so changing the height of the toolbar
    // will not raise or lower the position of the textae-body.
    // I would like to unify the behavior of the textae-body position
    // when scrolling with the browser and when not scrolling.
    // When displaying the hamburger menu button,
    // specify position: absolute for the toolbar
    // to exclude the toolbar from the calculation of the Y coordinate of the textae-body.
    // Instead, we will use JavaScript to adjust the position of the toolbar
    // as the browser scrolls.
    if (
      isTouchDevice() &&
      Math.max(document.documentElement.clientWidth, window.innerWidth) < 768
    ) {
      new Sticky('.textae-touch-bar', { stickyContainer: '.textae-editor' })
    }

    editor.eventEmitter
      .on('textae-event.control.button.push', ({ name }) => {
        this._updateButton(name, 'pushed')
      })
      .on('textae-event.control.buttons.change', (buttons) => {
        for (const name of buttons) {
          this._updateButton(name, 'disabled')
        }
      })
      .on('textae-event.control.writeButton.transit', () => {
        this._updateButton('write', 'transit')
      })
  }

  _updateButton(buttonName, stateName) {
    const button = this._el.querySelector(
      `.textae-control-${buttonName}-button`
    )

    if (button) {
      if (this._buttonController.getState(buttonName, stateName)) {
        button.classList.add(`textae-control-icon--${stateName}`)
      } else {
        button.classList.remove(`textae-control-icon--${stateName}`)
      }
    }
  }
}
