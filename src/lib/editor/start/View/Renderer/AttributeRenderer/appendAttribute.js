import idFactory from '../../../../idFactory'
import createAttributeHtml from './createAttributeHtml'
import getLabelDomOfType from '../../../getLabelDomOfType'

export default function(editor, pane, attribute) {
  const label = getLabelDomOfType(pane)
  const id = idFactory.makeAttributeDomId(editor, attribute.id)

  if (label.querySelector(`#${id}`)) {
    return
  }

  label.insertAdjacentHTML('beforeend', createAttributeHtml(id, attribute))
}
