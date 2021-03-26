export default function (numberOfSelectedEntities) {
  return numberOfSelectedEntities === 1
    ? '1 item selected'
    : numberOfSelectedEntities > 1
    ? `${numberOfSelectedEntities} items selected`
    : ''
}
