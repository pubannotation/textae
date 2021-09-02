import { NS } from '../NS'
import moveJetty from './moveJetty'

export default function (x, y, entity) {
  const jetty = document.createElementNS(NS.SVG, 'polyline')

  moveJetty(jetty, x, y, entity)

  return jetty
}
