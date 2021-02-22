export default class ViewHandler {
  jsPlumbConnectionClicked(jsPlumbConnection) {
    // Open link when view mode because link in label of jsPlumb event is not fired.
    const { link } = jsPlumbConnection
    if (link) {
      const href = link.getAttribute('href')
      window.open(href, '_blank')
    }
  }

  // Dummy funtion for shotcut key 'w'.
  changeInstance() {}

  // Dummy funtion for shotcut key '1' ~ '9'.
  manipulateAttribute() {}
}
