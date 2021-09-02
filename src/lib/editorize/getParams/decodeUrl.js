export default function (params, name) {
  if (params.has(name)) {
    params.set(name, decodeURIComponent(params.get(name)))
  }
}
