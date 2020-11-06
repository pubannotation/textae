import getEntityEndopoint from './getEntityEndopoint'
import getTypeValuesDom from './getTypeValuesDom'

const cssClass = 'ui-to-be-cut'

export default function (editor) {
  editor.eventEmitter.on('textae.clipBoard.change', (added, removed) => {
    for (const e of added) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        el.classList.add(cssClass)
        getTypeValuesDom(el).classList.add(cssClass)
      }
    }

    for (const e of removed) {
      const el = getEntityEndopoint(editor, e.id)
      if (el) {
        el.classList.remove(cssClass)
        getTypeValuesDom(el).classList.remove(cssClass)
      }
    }
  })
}
