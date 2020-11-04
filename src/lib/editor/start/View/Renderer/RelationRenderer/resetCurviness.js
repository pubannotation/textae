import determineCurviness from './determineCurviness'

export default function (relation) {
  const jsPlumbConnection = relation.jsPlumbConnection
  const curviness = determineCurviness(
    jsPlumbConnection.sourceEndpoint,
    jsPlumbConnection.targetEndpoint
  )

  jsPlumbConnection.resetCurviness(curviness)
}
