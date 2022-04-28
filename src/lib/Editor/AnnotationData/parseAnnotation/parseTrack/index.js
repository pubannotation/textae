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
    (src) => translateSpan(src, trackNumber),
    result.accept.denotation,
    'denotation'
  )

  importSource(
    [attributeContainer],
    (src) => translateAttribute(src, trackNumber),
    result.accept.attribute
  )

  importSource(
    [relationContainer],
    (src) => translateRelation(src, trackNumber),
    result.accept.relation
  )

  importSource(
    [spanContainer],
    (src) => {
      return { ...src, span: convertBeginAndEndToInteger(src.span) }
    },
    result.accept.typeSetting,
    'typesetting'
  )

  importSource(
    [spanContainer, entityContainer],
    (src) => translateSpan(src, trackNumber),
    result.accept.block,
    'block'
  )

  return result.reject
}

function importSource(targets, translater, source, type) {
  source = source.map(translater)

  for (const target of targets) {
    target.addSource(source, type)
  }
}
