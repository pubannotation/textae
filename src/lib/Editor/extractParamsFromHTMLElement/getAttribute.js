export default function (params, element, name) {
  if (element.getAttribute(name)) {
    params.set(name, element.getAttribute(name))
  }
}
