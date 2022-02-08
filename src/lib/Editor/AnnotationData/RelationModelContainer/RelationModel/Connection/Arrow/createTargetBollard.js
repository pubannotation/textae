import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default function () {
  const bollard = document.createElementNS(NS.SVG, 'polygon')
  bollard.setAttribute('points', `-4 0, 4 0, 0 ${MarkerHeight}`)

  return bollard
}
