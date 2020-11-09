export default function (dictionary, referedEntityId) {
  return dictionary.some((entry) => entry.id === referedEntityId)
}
