import { RemoveCommand } from './commandTemplate'

export default function (annotationData, items, pred) {
  return items
    .reduce((attrs, { attributes }) => attrs.concat(attributes), [])
    .filter((a) => a.pred === pred)
    .map((a) => new RemoveCommand(annotationData, 'attribute', a))
}
