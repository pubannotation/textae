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

function addTrackNumberAsIDPrefix(
  denotation,
  block,
  relation,
  attribute,
  trackNumber
) {
  return {
    denotations: denotation.map((src) => ({
      ...src,
      id: setIDPrefix(src, trackNumber)
    })),
    blocks: block.map((src) => ({
      ...src,
      id: setIDPrefix(src, trackNumber)
    })),
    relations: relation.map((src) => ({
      ...src,
      id: setIDPrefix(src, trackNumber),
      subj: trackNumber + src.subj,
      obj: trackNumber + src.obj
    })),
    attributes: attribute.map((src) => ({
      ...src,
      id: setIDPrefix(src, trackNumber),
      subj: trackNumber + src.subj,
      obj: src.obj
    }))
  }
}

// Set Prefx to the ID if ID exists.
// IF the ID does not exist, Set new ID in addSource function.
function setIDPrefix(src, trackNumber) {
  return src.id ? trackNumber + src.id : null
}
