export default function (self, getTarget, methods) {
  for (const method of methods) {
    const target = getTarget()
    console.assert(target[method], `No ${method} method to forward`, target)
    self[method] = (...args) => target[method].apply(target, args)
  }
}
