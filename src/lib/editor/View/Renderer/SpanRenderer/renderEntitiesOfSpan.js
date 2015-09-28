export default function(span, entityIdToModelFunc, renderEntityFunc) {
  span.getTypes()
      .forEach(type => renderEntitiesOfType(
          type,
          entityIdToModelFunc,
          renderEntityFunc
      ))
}

function renderEntitiesOfType(type, entityIdToModelFunc, renderEntityFunc) {
  type.entities
      .map(entityIdToModelFunc)
      .forEach(renderEntityFunc)
}
