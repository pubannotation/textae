import EditorContainer from './EditorContainer'
import setVeilObserver from './setVeilObserver'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import throttle from 'throttleit'
import keyInputHandler from './keyInputHandler'

// The tool manages interactions between components.
export default function() {
  const editors = new EditorContainer()

  // Start observation at document ready, because this function may be called before body is loaded.
  window.addEventListener('load', () => {
    editors.observeKeyInput((e) => keyInputHandler(editors, e))
    redrawOnResize(editors)
    selectUnselectEditorOn(editors)
  })

  return {
    // Register editors to tool
    registerEditor: (editor) => registerEditor(editors, editor)
  }
}

// Observe window-resize event and redraw all editors.
function redrawOnResize(editors) {
  // Bind resize event
  window.addEventListener('resize', throttle(() => editors.redraw(), 500))
}

function registerEditor(container, editor) {
  container.push(editor)

  setVeilObserver(editor[0])
}
