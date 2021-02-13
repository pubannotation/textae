import $ from 'jquery'
import determineCurviness from '../../../../determineCurviness'
import connectorStrokeStyle from './connectorStrokeStyle'
import toDisplayName from '../toDisplayName'
import arrowConfig from '../../../../arrowConfig'

// Make a connect by jsPlumb.
export default function (
  jsPlumbInstance,
  relation,
  annotationData,
  typeDefinition
) {
  const { sourceEndpoint } = relation
  const { targetEndpoint } = relation

  return jsPlumbInstance.connect({
    source: $(sourceEndpoint),
    target: $(targetEndpoint),
    anchors: ['TopCenter', 'TopCenter'],
    connector: [
      'Bezier',
      {
        curviness: determineCurviness(sourceEndpoint, targetEndpoint)
      }
    ],
    paintStyle: connectorStrokeStyle(
      annotationData,
      typeDefinition,
      relation.id
    ),
    parameters: {
      id: relation.id
    },
    cssClass: 'textae-editor__relation',
    overlays: [
      ['Arrow', arrowConfig.normal],
      [
        'Label',
        {
          id: 'textae-relation-label',
          label: toDisplayName(relation, annotationData, typeDefinition),
          cssClass: 'textae-editor__relation__label'
        }
      ]
    ]
  })
}
