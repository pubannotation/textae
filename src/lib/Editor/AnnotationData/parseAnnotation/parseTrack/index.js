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

  const { typeSetting } = accept
  const typesettings = typeSetting.map((src) => ({
    ...src,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(typesettings, 'typesetting')

  const { denotation } = accept
  const denotations = denotation.map((src) => ({
    ...src,
    id: src.id ? trackNumber + src.id : null,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')

  const { block } = accept
  const blocks = block.map((src) => ({
    ...src,
    id: src.id ? trackNumber + src.id : null,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')

  const { relation } = accept
  const relations = relation.map((src) => ({
    ...src,
    id: src.id ? trackNumber + src.id : null,
    subj: trackNumber + src.subj,
    obj: trackNumber + src.obj
  }))
  relationContainer.addSource(relations)

  const { attribute } = accept
  const attributes = attribute.map((src) => ({
    ...src,
    id: src.id ? trackNumber + src.id : null,
    subj: trackNumber + src.subj,
    obj: src.obj
  }))
  attributeContainer.addSource(attributes)

  return reject
}
