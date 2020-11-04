export default function (selected) {
  return selected.size === 1 ? selected.values().next().value : null
}
