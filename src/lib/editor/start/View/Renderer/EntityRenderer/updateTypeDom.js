import dohtml from 'dohtml'
import createTypeValuesHtml from './createTypeValuesHtml'

export default function(namespace, typeContainer, type) {
  const typeDom = document.querySelector(`#${type.id}`)
  const newNode = dohtml.create(
    createTypeValuesHtml(type, namespace, typeContainer)
  )
  const oldNode = typeDom.querySelector('.textae-editor__type-values')

  typeDom.replaceChild(newNode, oldNode)
}
