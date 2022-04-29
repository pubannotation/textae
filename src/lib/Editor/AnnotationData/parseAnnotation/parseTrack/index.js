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

  const { typeSetting } = accept
  const typesettings = typeSetting.map((src) => ({
    ...src,
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(typesettings, 'typesetting')

  const { denotation } = accept
  const denotations = denotation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(denotations, 'denotation')
  entityContainer.addSource(denotations, 'denotation')

  const { block } = accept
  const blocks = block.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    span: convertBeginAndEndToInteger(src.span)
  }))
  spanContainer.addSource(blocks, 'block')
  entityContainer.addSource(blocks, 'block')

  const { relation } = accept
  const relations = relation.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: trackNumber + src.obj
  }))
  relationContainer.addSource(relations)

  const { attribute } = accept
  const attributes = attribute.map((src) => ({
    ...src,
    id: setIDPrefix(src, trackNumber),
    subj: trackNumber + src.subj,
    obj: src.obj
  }))
  attributeContainer.addSource(attributes)

  return reject
}

// If the begin or end value is a string,
// the comparison with other numbers cannot be done correctly.
// You cannot generate a valid value for the ID of HTML element of span
// from a begin or end that contains a decimal point.
function convertBeginAndEndToInteger(span) {
  return { ...span, begin: parseInt(span.begin), end: parseInt(span.end) }
}

// Set Prefx to the ID if ID exists.
// IF the ID does not exist, Set new ID in addSource function.
function setIDPrefix(src, trackNumber) {
  return src.id ? trackNumber + src.id : null
}
