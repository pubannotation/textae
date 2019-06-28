export default function(map, key, value) {
  if (map.has(key)) {
    map.get(key)(value)
  }
}
