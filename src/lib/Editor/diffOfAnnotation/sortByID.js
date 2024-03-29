import byID from './byID'

export default function sortByID({
  denotations = [],
  attributes = [],
  relations = [],
  blocks = []
}) {
  return {
    denotations: denotations.sort(byID),
    attributes: attributes.sort(byID),
    relations: relations.sort(byID),
    blocks: blocks.sort(byID)
  }
}
