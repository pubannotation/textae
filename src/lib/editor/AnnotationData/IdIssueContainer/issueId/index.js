import getNextId from './getNextId'

export default function (instance, container, prefix) {
  if (!instance.id) {
    // Overwrite to revert
    const ids = Array.from(container.keys())
    const newId = getNextId(prefix, ids)
    instance.id = newId
  }
  return instance
}
