import getNextId from '../getNextId'

export default function addToContainer(instance, container, prefix) {
  if (!instance.id) {
    // Overwrite to revert
    const ids = Array.from(container.keys())
    const newId = getNextId(prefix, ids)
    instance.id = newId
  }
  container.set(instance.id, instance)
  return instance
}
