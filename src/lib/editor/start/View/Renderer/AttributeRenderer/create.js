import getEntityDom from '../../../getEntityDom'
import appendAttribute from './appendAttribute'

export default function(editor, attribute) {
  const entityDom = getEntityDom(editor[0], attribute.subj)

  if (!entityDom) {
    throw new Error("entity is not rendered : " + attribute.subj)
  }

  const typeDom = entityDom.closest('.textae-editor__type')
  appendAttribute(typeDom, attribute)
}
