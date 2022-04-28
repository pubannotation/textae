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
  const result = validateAnnotation(text, spans, rowData)

  importSource(
    [spanContainer, entityContainer],
    result.accept.denotation.map((src) => translateSpan(src, trackNumber)),
    'denotation'
  )

  importSource(
    [attributeContainer],
    result.accept.attribute.map((src) => translateAttribute(src, trackNumber))
  )

  importSource(
    [relationContainer],
    result.accept.relation.map((src) => translateRelation(src, trackNumber))
  )

  importSource(
    [spanContainer],
    result.accept.typeSetting.map((src) => ({
      ...src,
      span: convertBeginAndEndToInteger(src.span)
    })),
    'typesetting'
  )

  importSource(
    [spanContainer, entityContainer],
    result.accept.block.map((src) => translateSpan(src, trackNumber)),
    'block'
  )

  return result.reject
}

function importSource(targets, source, type) {
  for (const target of targets) {
    target.addSource(source, type)
  }
}
