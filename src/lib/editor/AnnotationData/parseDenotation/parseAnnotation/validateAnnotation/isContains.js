export default function(dictionary, node, property) {
  return dictionary.filter((entry) => entry.id === node[property]).length === 1
}
