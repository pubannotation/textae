import idFactory from '../../../../idFactory'
import createAttributeHtml from './createAttributeHtml'

export default function(editor, pane, attribute) {
  const label = pane.nextElementSibling
  const id = idFactory.makeAttributeDomId(editor, attribute.id)

  if (label.querySelector(`#${id}`)) {
    return
  }

  label.insertAdjacentHTML('beforeend', createAttributeHtml(id, attribute))
}
