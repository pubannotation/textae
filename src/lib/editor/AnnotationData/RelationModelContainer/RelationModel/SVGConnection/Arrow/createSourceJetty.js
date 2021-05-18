import createJetty from './createJetty'

export default function ({ sourceX, sourceY }, entity, annotationBox) {
  return createJetty(sourceX, sourceY, entity, annotationBox)
}
