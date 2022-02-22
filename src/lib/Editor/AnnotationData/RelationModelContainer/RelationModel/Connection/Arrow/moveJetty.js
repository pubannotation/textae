import { MarkerHeight } from './MarkerHeight'

/**
 *
 * @param {Element} jetty
 * @param {number} x
 * @param {number} y
 * @param {import('../../../../../EntityModel').default} entity
 */
export default function (jetty, x, y, entity) {
  jetty.setAttribute(
    'points',
    `${x} ${y + MarkerHeight}, ${entity.center} ${y + MarkerHeight}, ${
      entity.center
    } ${entity.offsetTop}`
  )
}
