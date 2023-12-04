import IDConflictResolver from './IDConflictResolver'
import convertBeginAndEndOfSpanToInteger from './convertBeginAndEndOfSpanToInteger'

export default function (
  spanContainer,
  entityContainer,
  attributeContainer,
  relationContainer,
  accept,
  trackNumber = ''
) {
  const [typeSettings, denotation, block] = convertBeginAndEndOfSpanToInteger(
    accept.typeSetting,
    accept.denotation,
    accept.block
  )
  const { relation, attribute } = accept
  const { denotations, blocks, relations, attributes } = new IDConflictResolver(
    trackNumber
  ).addTrackNumberAsIDPrefix(denotation, block, relation, attribute)

  spanContainer.addSource(typeSettings, 'typesetting')
  spanContainer.addSource(denotations, 'denotation')
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(blocks, 'block')
  relationContainer.addSource(relations)
  attributeContainer.addSource(attributes)
}
