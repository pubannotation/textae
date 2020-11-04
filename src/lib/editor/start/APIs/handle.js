export default function (map, key, ...values) {
  if (map.has(key)) {
    map.get(key)(...values)
  }
}
