import validateAnnotation from './validateAnnotation'
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

  const attributes = accept.attribute.map((src) => ({
    ...src,
    id: setIdPrefixIfExist(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: src.obj
  }))
  attributeContainer.addSource(attributes)

  return reject
}

function setIdPrefixIfExist(src, prefix) {
  // An id will be generated if id is null.
  // But an undefined is convert to string as 'undefined' when it add to any string.
  return src.id ? prefix + src.id : null
}
