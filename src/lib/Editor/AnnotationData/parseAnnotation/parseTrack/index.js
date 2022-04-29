import addTrackNumberAsIDPrefix from './addTrackNumberAsIDPrefix'
import convertBeginAndEndOfSpanToInteger from './convertBeginAndEndOfSpanToInteger'
import validateAnnotation from './validateAnnotation'

export default function (
  spanContainer,
  entityContainer,
  attributeContainer,
  relationContainer,
  text,
  spans,
  rowData,
  trackNumber = ''
) {
  const { accept, reject } = validateAnnotation(text, spans, rowData)
  const [typeSettings, denotation, block] = convertBeginAndEndOfSpanToInteger(
    accept.typeSetting,
    accept.denotation,
    accept.block
  )
  const { relation, attribute } = accept
  const { denotations, blocks, relations, attributes } =
    addTrackNumberAsIDPrefix(
      denotation,
      block,
      relation,
      attribute,
      trackNumber
    )

  spanContainer.addSource(typeSettings, 'typesetting')
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')
  relationContainer.addSource(relations)
  attributeContainer.addSource(attributes)

  return reject
}
