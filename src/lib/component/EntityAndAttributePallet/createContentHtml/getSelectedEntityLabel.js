export default function (numberOfSelectedEntities) {
  return numberOfSelectedEntities === 1
    ? '1 entity selected'
    : numberOfSelectedEntities > 1
    ? `${numberOfSelectedEntities} entities selected`
    : ''
}
