export default function(span, attributeIdToModelFunc, entityToModelFunc, renderAttributeFunc) {
  span.getTypes()
      .forEach(type => renderAttributesOfType(
          type,
          attributeIdToModelFunc,
          entityToModelFunc,
          renderAttributeFunc
      ))
}

function renderAttributesOfType(type, attributeIdToModelFunc, entityToModelFunc, renderAttributeFunc) {
  type.attributes
      .map(attributeIdToModelFunc)
      .forEach(attribute => renderAttributeFunc(
        attribute,
        type.entities.map(entityToModelFunc)
      ))
}
