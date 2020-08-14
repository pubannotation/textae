import getEntityDom from '../getEntityDom'
import applyTypeValues from './applyTypeValues'

const cssClass = 'ui-to-be-cut'

export default function(editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    for (const e of added) {
      const el = getEntityDom(editor, e.id)
      if (el) {
        el.classList.add(cssClass)
        applyTypeValues(el, cssClass)
      }
    }

    for (const e of removed) {
      const el = getEntityDom(editor, e.id)
      if (el) {
        el.classList.remove(cssClass)
        applyTypeValues(el, cssClass)
      }
    }
  })
}
