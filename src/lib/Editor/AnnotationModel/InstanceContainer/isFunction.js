// see: https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
export default function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  )
}
