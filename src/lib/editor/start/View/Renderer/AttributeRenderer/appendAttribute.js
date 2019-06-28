import idFactory from '../../../../idFactory'
import createAttributeHtml from './createAttributeHtml'

export default function(editor, pane, attribute) {
  const id = idFactory.makeAttributeDomId(editor, attribute.id)
  pane.nextElementSibling.insertAdjacentHTML('beforeend', createAttributeHtml(id, attribute))
}
