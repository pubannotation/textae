import { MarkerHeight } from './MarkerHeight'

export default function (jetty, x, y, entity) {
  jetty.setAttribute(
    'points',
    `${x} ${y + MarkerHeight}, ${entity.center} ${y + MarkerHeight}, ${
      entity.center
    } ${entity.top}`
  )
}
