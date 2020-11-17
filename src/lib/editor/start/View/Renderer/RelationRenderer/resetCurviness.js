import determineCurviness from './determineCurviness'

export default function (relation) {
  const curviness = determineCurviness(
    relation.sourceEndpoint,
    relation.targetEndpoint
  )

  relation.jsPlumbConnection.resetCurviness(curviness)
}
