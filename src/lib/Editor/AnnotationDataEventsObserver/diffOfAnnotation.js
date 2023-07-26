import { diff } from 'jsondiffpatch'

export default function diffOfAnnotation(oldAnnotation, newAnnotation) {
  return diff(prepareDiff(oldAnnotation), prepareDiff(newAnnotation))
}

function prepareDiff({
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

function byID(a, b) {
  if (a.id < b.id) {
    return -1
  }
  if (a.id > b.id) {
    return 1
  }
  return 0
}
