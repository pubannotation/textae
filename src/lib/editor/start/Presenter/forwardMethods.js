export default function (self, getTarget, methods) {
  for (const method of methods) {
    const target = getTarget()
    self[method] = (...args) => target[method].apply(target, args)
  }
}
