import $ from 'jquery'
import determineCurviness from './determineCurviness'
import toDisplayName from '../toDisplayName'
import converseHEXinotRGBA from './converseHEXinotRGBA'

// Make a connect by jsPlumb.
export default function (
  jsPlumbInstance,
  relation,
  namespace,
  definitionContainer,
  arrowConfig
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
    paintStyle: {
      strokeStyle: converseHEXinotRGBA(relation.getColor(definitionContainer))
    },
    cssClass: 'textae-editor__relation',
    overlays: [
      ['Arrow', arrowConfig],
      [
        'Label',
        {
          id: 'textae-relation-label',
          label: toDisplayName(relation, namespace, definitionContainer),
          cssClass: 'textae-editor__relation__label'
        }
      ]
    ]
  })
}
