import validateAnnotation from './validateAnnotation'
import translateAttribute from './translateAttribute'
import convertBeginAndEndToInteger from './convertBeginAndEndToInteger'
import setIdPrefixIfExist from './setIdPrefixIfExist'

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

  const typesettings = accept.typeSetting.map((src) => ({
    ...src,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(typesettings, 'typesetting')

  const denotations = accept.denotation.map((src) => ({
    ...src,
    id: setIdPrefixIfExist(src, trackNumber),
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')

  const blocks = accept.block.map((src) => ({
    ...src,
    id: setIdPrefixIfExist(src, trackNumber),
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')

  const relations = accept.relation.map((src) => ({
    ...src,
    id: setIdPrefixIfExist(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: trackNumber + src.obj
  }))
  relationContainer.addSource(relations)

  const attributes = accept.attribute.map((src) =>
    translateAttribute(src, trackNumber)
  )
  attributeContainer.addSource(attributes)

  return reject
}
