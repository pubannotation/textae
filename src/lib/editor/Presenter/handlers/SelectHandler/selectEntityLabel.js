import selectEntity from './selectEntity'

export default function selectEntityLabel(selectionModel, dom) {
  console.assert(selectionModel, 'selectionModel MUST exists')

  if (dom) {
    let pane = dom.nextElementSibling,
      children = pane.children,
      ids = Array.from(children).map(dom => dom.title)

    selectEntity(selectionModel, ids)
  }
}
