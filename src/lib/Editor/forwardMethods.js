export default function (delegator, getTargetFunction, methods) {
  for (const method of methods) {
    delegator[method] = (...args) => {
      // Determine the target when executing the method
      const target = getTargetFunction()
      console.assert(target[method], `No ${method} method to forward`, target)

      return target[method].apply(target, args)
    }
  }

  return delegator
}
