import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'
import getEntityEndopoint from './getEntityEndopoint'

const cssClass = 'ui-to-be-cut'

export default function (editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    for (const e of added) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        const entityHTMLElement = getEntityHTMLelementFromChild(el)
        entityHTMLElement.classList.add(cssClass)
      }
    }

    for (const e of removed) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        const entityHTMLElement = getEntityHTMLelementFromChild(el)
        entityHTMLElement.classList.remove(cssClass)
      }
    }
  })
}
