export default function (element) {
  // 'source' prefer to 'target'
  return element.getAttribute('source') || element.getAttribute('target')
}
