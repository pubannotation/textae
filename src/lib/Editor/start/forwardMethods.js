export default function (delegator, getTargetFunction, methods) {
  for (const method of methods) {
    delegator[method] = (...args) => {
      const target = getTargetFunction()
      console.assert(target[method], `No ${method} method to forward`, target)

      return target[method].apply(target, args)
    }
  }
}
