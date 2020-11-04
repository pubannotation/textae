export default function (span, entities) {
  return span.entities.every((entity) => entities.includes(entity))
}
