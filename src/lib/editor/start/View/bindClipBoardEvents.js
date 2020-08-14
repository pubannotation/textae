import getEntityDom from '../getEntityDom'
import applyEntityTypeValues from './applyEntityTypeValues'

export default function(editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    const cssClass = 'ui-to-be-cut'
    for (const e of added) {
      const el = getEntityDom(editor, e.id)
      if (el) {
        el.classList.add(cssClass)
        applyEntityTypeValues(el, cssClass)
      }
    }
    for (const e of removed) {
      const el = getEntityDom(editor, e.id)
      if (el) {
        el.classList.remove(cssClass)
        applyEntityTypeValues(el, cssClass)
      }
    }
  })
}
