export default function(span, entityIdToModelFunc, renderEntityFunc, attributeIdToModelFunc, renderAttributeFunc) {
  span.getTypes()
      .forEach(type => renderEntitiesOfType(
          type,
          entityIdToModelFunc,
          renderEntityFunc,
          attributeIdToModelFunc,
          renderAttributeFunc
      ))
}

function renderEntitiesOfType(type, entityIdToModelFunc, renderEntityFunc, attributeIdToModelFunc, renderAttributeFunc) {
  type.entities
      .map(entityIdToModelFunc)
      .forEach(renderEntityFunc)

  type.attributes
      .map(attributeIdToModelFunc)
      .forEach(renderAttributeFunc)
}
