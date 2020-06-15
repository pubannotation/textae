import getEntityDom from '../getEntityDom'
import apllyEntityTypeValues from './apllyEntityTypeValues'

export default function(editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    const cssClass = 'ui-to-be-cut'
    for (const e of added) {
      const el = getEntityDom(editor[0], e.id)
      if (el) {
        el.classList.add(cssClass)
        apllyEntityTypeValues(el, cssClass)
      }
    }
    for (const e of removed) {
      const el = getEntityDom(editor[0], e.id)
      if (el) {
        el.classList.remove(cssClass)
        apllyEntityTypeValues(el, cssClass)
      }
    }
  })
}
