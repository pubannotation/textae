// Focus of the editor or children element is necessary to listen to keyboard events.
// Elements be able to focused are the editor, spans and entity types.
// The focus is lost when spans or entity types are remove.
// Next elements are seleced autmatically by user deleting.
// Next elements are not seleced autmatically by undo creation.
// So, focus the editer when spans or entity types are removed and lost focus.
export default function (editorHTMLElement) {
  // Observe a removing the focused document object.
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.removedNodes.length &&
        mutation.removedNodes[0].nodeType === 1
      ) {
        if (
          mutation.removedNodes[0].classList.contains('textae-editor__span') ||
          mutation.removedNodes[0].classList.contains('textae-editor__type')
        ) {
          if (document.activeElement.tagName === 'BODY') {
            editorHTMLElement.focus()
          }
        }
      }
    })
  }).observe(editorHTMLElement.querySelector('.textae-editor__body'), {
    childList: true,
    subtree: true
  })
}
