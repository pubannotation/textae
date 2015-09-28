import {
  EventEmitter as EventEmitter
}
from 'events'
import EditorContainer from './EditorContainer'
import ControlButtonHandler from './ControlButtonHandler'
import KeyInputHandler from './KeyInputHandler'
import observeKeyWithoutDialog from './observeKeyWithoutDialog'
import HelpDialog from '../component/HelpDialog'

let helpDialog = new HelpDialog()

// The tool manages interactions between components.
export default function() {
  let controlBar = new ControlBar(),
    editors = new EditorContainer(),
    handleControlButtonClick = new ControlButtonHandler(helpDialog, editors)

  // Start observation at document ready, because this function may be called before body is loaded.
  window.addEventListener('load', () => {
    let handleKeyInput = new KeyInputHandler(helpDialog, editors)

    observeKeyWithoutDialog(handleKeyInput)
    redrawOnResize(editors)
  })

  return {
    // Register a control to tool.
    setControl: (instance) => {
      // Use arguments later than first.
      // Because the first argmest of event handlers of the jQuery event is jQuery event object.
      instance
        .on('textae.control.button.click', (e, ...rest) => handleControlButtonClick(...rest))

      controlBar.setInstance(instance)
    },
    // Register editors to tool
    pushEditor: (editor) => {
      editors.push(editor)

      // Add an event emitter to the editer.
      let emitter = new EventEmitter()
        .on('textae.editor.select', () => editors.select(editor))
        .on('textae.control.button.push', (data) => {
          if (editor === editors.getSelected())
            controlBar.push(data.buttonName, data.state)
        })
        .on('textae.control.buttons.change', (enableButtons) => {
          if (editor === editors.getSelected())
            controlBar.changeButtonState(enableButtons)
        })

      Object.assign(editor, {
        editorId: editors.getNewId(),
        eventEmitter: emitter
      })
    },
    // Select the first editor
    selectFirstEditor: () => {
      // Disable all buttons.
      controlBar.changeButtonState()
      editors.selectFirst()
    },
  }
}

function ControlBar() {
  let control = null

  return {
    setInstance: (instance) => control = instance,
    changeButtonState: (enableButtons) => {
      if (control) {
        control.updateAllButtonEnableState(enableButtons)
      }
    },
    push: (buttonName, push) => {
      if (control)
        control.updateButtonPushState(buttonName, push)
    }
  }
}

// Observe window-resize event and redraw all editors.
function redrawOnResize(editors) {
  // Bind resize event
  window
    .addEventListener('resize', _.debounce(() => {
      // Redraw all editors per editor.
      editors.forEach((editor) => window.requestAnimationFrame(editor.api.redraw))
    }, 500))
}
