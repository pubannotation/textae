export default function(span, attributeIdToModelFunc, renderAttributeFunc) {
  span.getTypes()
      .forEach(type => renderAttributesOfType(
          type,
          attributeIdToModelFunc,
          renderAttributeFunc
      ))
}

function renderAttributesOfType(type, attributeIdToModelFunc, renderAttributeFunc) {
  type.attributes
      .map(attributeIdToModelFunc)
      .forEach(attribute => renderAttributeFunc(attribute))
}
