import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function () {
  const bollard = document.createElementNS(NS.SVG, 'polygon')
  bollard.setAttribute('points', `-4 ${MarkerHeight}, 4 ${MarkerHeight}, 0 0`)

  return bollard
}
