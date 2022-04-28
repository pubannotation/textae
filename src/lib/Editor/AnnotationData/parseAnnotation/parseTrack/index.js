import validateAnnotation from './validateAnnotation'
import translateSpan from './translateSpan'
import translateAttribute from './translateAttribute'
import translateRelation from './translateRelation'
import convertBeginAndEndToInteger from './convertBeginAndEndToInteger'

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

  const denotations = accept.denotation.map((src) =>
    translateSpan(src, trackNumber)
  )
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')

  const attributes = accept.attribute.map((src) =>
    translateAttribute(src, trackNumber)
  )
  attributeContainer.addSource(attributes)

  const relations = accept.relation.map((src) =>
    translateRelation(src, trackNumber)
  )
  relationContainer.addSource(relations)

  const typesettings = accept.typeSetting.map((src) => ({
    ...src,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(typesettings, 'typesetting')

  const blocks = accept.block.map((src) => translateSpan(src, trackNumber))
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')

  return reject
}
