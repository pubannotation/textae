import reflectTypeGapInTheHeight from '../../reflectTypeGapInTheHeight'

export default function(entity, typeGap) {
  const entityElement = entity.element
  if (entityElement) {
    reflectTypeGapInTheHeight(entityElement, typeGap())
  }
}
