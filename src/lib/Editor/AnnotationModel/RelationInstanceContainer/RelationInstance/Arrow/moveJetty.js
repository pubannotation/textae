import { MarkerHeight } from './MarkerHeight'

/**
 *
 * @param {Element} jetty
 * @param {number} x
 * @param {number} y
 * @param {import('../../../../../EntityInstance').default} entity
 */
export default function (jetty, x, y, entity) {
  jetty.setAttribute(
    'points',
    `${x} ${y + MarkerHeight}, ${entity.offsetCenter} ${y + MarkerHeight}, ${
      entity.offsetCenter
    } ${entity.offsetTop}`
  )
}
