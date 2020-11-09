export default function (dictionary, referedEntityId) {
  return dictionary.filter((entry) => entry.id === referedEntityId).length === 1
}
