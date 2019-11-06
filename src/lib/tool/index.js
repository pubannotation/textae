import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import keyInputHandler from './keyInputHandler'
import redrawOnResize from './redrawOnResize'
import registerEditor from './registerEditor'

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
