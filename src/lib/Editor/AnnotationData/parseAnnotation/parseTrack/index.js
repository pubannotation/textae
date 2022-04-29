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
  const [typeSetting, denotation, block] = convertBeginAndEndOfSpanToInteger(
    accept.typeSetting,
    accept.denotation,
    accept.block
  )
  const { relation, attribute } = accept

  spanContainer.addSource(typeSetting, 'typesetting')

  const denotations = denotation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber)
  }))
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')

  const blocks = block.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber)
  }))
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')

  const relations = relation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: trackNumber + src.obj
  }))
  relationContainer.addSource(relations)

  const attributes = attribute.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: src.obj
  }))
  attributeContainer.addSource(attributes)

  return reject
}

// Set Prefx to the ID if ID exists.
// IF the ID does not exist, Set new ID in addSource function.
function setIDPrefix(src, trackNumber) {
  return src.id ? trackNumber + src.id : null
}
