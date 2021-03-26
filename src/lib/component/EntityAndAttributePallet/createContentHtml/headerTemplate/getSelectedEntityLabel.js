export default function (numberOfSelectedItems) {
  return numberOfSelectedItems === 1
    ? '1 item selected'
    : numberOfSelectedItems > 1
    ? `${numberOfSelectedItems} items selected`
    : ''
}
