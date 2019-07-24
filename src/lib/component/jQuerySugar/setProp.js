export default function(key, $target, className, value) {
  const valueObject = {}

  valueObject[key] = value

  return $target
    .find(className)
    .prop(valueObject)
    .end()
}
