import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'
import getEntityEndopoint from './getEntityEndopoint'
import getTypeValues from './getTypeValues'

const cssClass = 'ui-to-be-cut'

export default function (editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    for (const e of added) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        el.classList.add(cssClass)
        getTypeValues(el).classList.add(cssClass)

        const entityHTMLElement = getEntityHTMLelementFromChild(el)
        entityHTMLElement.classList.add(cssClass)
      }
    }

    for (const e of removed) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        el.classList.remove(cssClass)
        getTypeValues(el).classList.remove(cssClass)

        const entityHTMLElement = getEntityHTMLelementFromChild(el)
        entityHTMLElement.classList.remove(cssClass)
      }
    }
  })
}
