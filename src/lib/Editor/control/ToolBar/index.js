import Sticky from 'sticky-js'

import getPalletButtonTitleFor from '../../getPalletButtonTitleFor'
import isTouchable from '../../isTouchable'
import classify from '../classify'
import Menu from '../Menu'
import toButtonGroup from './toButtonGroup'

function template(context) {
  return `
<div class="textae-control ${
    isTouchable() ? 'textae-touch-bar' : 'textae-control-bar'
  }">
  <div class="textae-control-summary">
    <span class="textae-control-title">
      <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    <button type="button" class="textae-control-hamburger-menu-button" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
      </svg>
    </button>
  </div>
  <div class="textae-control-details ${context.detailModifierClassName}">
    <span class="textae-control-title">
      <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    ${classify(context.controlBarButton).map(toButtonGroup()).join('\n')}
  </div>
</div>
`
}

// The control is a control bar in an editor.
export default class ToolBar extends Menu {
  #menuState

  /**
   *
   * @param {import('../../UseCase/MenuState').MenuState} menuState
   */
  constructor(eventEmitter, menuState, iconEventMap) {
    super(template(menuState), iconEventMap)

    this.#menuState = menuState

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
      isTouchable() &&
      Math.max(document.documentElement.clientWidth, window.innerWidth) < 768
    ) {
      new Sticky('.textae-touch-bar', { stickyContainer: '.textae-editor' })
    }

    eventEmitter
      .on('textae-event.control.button.push', ({ name }) => {
        this.#updateButton(name, 'pushed')
      })
      .on('textae-event.control.buttons.change', (buttons) => {
        for (const name of buttons) {
          this.#updateButton(name, 'disabled')
        }
      })
      .on('textae-event.annotation-data.events-observer.unsaved-change', () => {
        this.#updateButton('upload', 'transit')
      })
      .on('textae-event.edit-mode.transition', (mode) => {
        // The palette is not used in text editing mode.
        const title = getPalletButtonTitleFor(mode)
        const button = super._querySelector(`.textae-control-pallet-button`)
        button.title = title
      })
      .on('textae-event.configuration.reset', () => this.#redrawAllButtons())
      .on('textae-event.type-definition.entity.change', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.entity.delete', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.entity.change-default', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.relation.change', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.relation.delete', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.relation.change-default', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.attribute.create', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.attribute.change', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.attribute.delete', () =>
        this.#updateButton('pallet', 'transit')
      )
      .on('textae-event.type-definition.attribute.move', () =>
        this.#updateButton('pallet', 'transit')
      )
  }

  #updateButton(buttonName, stateName) {
    const button = super._querySelector(
      `.textae-control-${buttonName.replaceAll(' ', '-')}-button`
    )

    if (button) {
      if (this.#menuState.getState(buttonName, stateName)) {
        button.classList.add(`textae-control-icon--${stateName}`)
      } else {
        button.classList.remove(`textae-control-icon--${stateName}`)
      }
    }
  }

  #redrawAllButtons() {
    super.el.innerHTML = ''
    super.el.insertAdjacentHTML('beforeend', template(this.#menuState))
  }
}
