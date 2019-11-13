export default function(types) {
  const summary = {
    name: '',
    attributes: []
  }
  return types.reduce((sum, type) => type.mergeType(sum), summary)
}
