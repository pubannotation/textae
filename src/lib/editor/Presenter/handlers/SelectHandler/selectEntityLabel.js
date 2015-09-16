import selectEntity from './selectEntity'

export default function selectEntityLabel(selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST exists')

  if (dom) {
    let pane = dom.nextElementSibling,
      allEntityOflabels = pane.children

    if (!isMulti)
      selectionModel.clear()

    selectionModel.entity.add(Array.from(allEntityOflabels).map(dom => dom.title))
  }
}
