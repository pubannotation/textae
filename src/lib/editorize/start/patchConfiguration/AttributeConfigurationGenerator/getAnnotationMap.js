import AnnotationsForPred from './AnnotationsForPred'

export default function (annotations) {
  return annotations.reduce((map, attr) => {
    if (map.has(attr.pred)) {
      map.get(attr.pred).push(attr.obj)
    } else {
      map.set(attr.pred, new AnnotationsForPred(attr))
    }
    return map
  }, new Map())
}
