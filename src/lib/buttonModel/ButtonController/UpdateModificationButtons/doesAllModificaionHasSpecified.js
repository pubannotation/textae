export default function(specified, modificationsOfSelectedElement) {
  if (modificationsOfSelectedElement.length < 0) {
    return false
  }
  return modificationsOfSelectedElement.length === modificationsOfSelectedElement.filter((m) => m.includes(specified)).length
}
