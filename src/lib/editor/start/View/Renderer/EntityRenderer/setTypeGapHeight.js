import reflectTypeGapInTheHeight from '../../reflectTypeGapInTheHeight'

export default function (entity, typeGap) {
  if (entity.isDenotation) {
    const entityElement = entity.element
    if (entityElement) {
      reflectTypeGapInTheHeight(entityElement, typeGap())
    }
  }
}
