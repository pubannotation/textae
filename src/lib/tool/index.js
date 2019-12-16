import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import redrawOnResize from './redrawOnResize'
import setVeilObserver from './setVeilObserver'

// The tool manages interactions between components.
export default function() {
  const editors = new EditorContainer()
  redrawOnResize(editors)

  // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
  // When the load event occurs, bind the event handler of document.body.
  window.addEventListener('load', () => {
    selectUnselectEditorOn(editors)
  })

  return {
    // Register editors to tool
    registerEditor: (editor) => {
      editors.push(editor)
      setVeilObserver(editor[0])
    }
  }
}
