import $ from 'jquery'
import determineCurviness from '../../determineCurviness'
import getEntityEndopointDom from '../../../../getEntityEndopointDom'
import LABEL from '../../../../../LABEL'
import connectorStrokeStyle from '../../connectorStrokeStyle'
import NORMAL_ARROW from '../../NORMAL_ARROW'
import toLabelString from '../../toLabelString'

// Make a connect by jsPlumb.
export default function(
  jsPlumbInstance,
  editor,
  relation,
  annotationData,
  typeDefinition
) {
  return jsPlumbInstance.connect({
    source: $(getEntityEndopointDom(editor, relation.subj)),
    target: $(getEntityEndopointDom(editor, relation.obj)),
    anchors: ['TopCenter', 'TopCenter'],
    connector: [
      'Bezier',
      {
        curviness: determineCurviness(editor, annotationData, relation)
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
      ['Arrow', NORMAL_ARROW],
      [
        'Label',
        Object.assign({}, LABEL, {
          label: toLabelString(relation, annotationData, typeDefinition),
          cssClass: `${LABEL.cssClass}`
        })
      ]
    ]
  })
}
