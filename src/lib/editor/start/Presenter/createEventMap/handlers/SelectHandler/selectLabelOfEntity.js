import getLabelDomOfType from '../../../../getLabelDomOfType'

export default function(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.')

  const label = getLabelDomOfType(entity)
  selectionModel.selectEntityLabel(label)
}
