import $ from 'jquery'
import determineCurviness from '../../determineCurviness'
import jsPlumbArrowOverlayUtil from '../../jsPlumbArrowOverlayUtil'
import getEntityDom from '../../../../../getEntityDom'
import LABEL from '../../LABEL'
import connectorStrokeStyle from '../../connectorStrokeStyle'

// Make a connect by jsPlumb.
export default function(jsPlumbInstance, editor, relation, annotationData, typeContainer, modificationRenderer) {
  return jsPlumbInstance.connect({
    source: $(getEntityDom(editor[0], relation.subj)),
    target: $(getEntityDom(editor[0], relation.obj)),
    anchors: ['TopCenter', "TopCenter"],
    connector: ['Bezier', {
      curviness: determineCurviness(editor, annotationData, relation)
    }],
    paintStyle: connectorStrokeStyle(annotationData, typeContainer, relation.id),
    parameters: {
      id: relation.id,
    },
    cssClass: 'textae-editor__relation',
    overlays: [
      ['Arrow', jsPlumbArrowOverlayUtil.NORMAL_ARROW],
      ['Label', Object.assign({}, LABEL, {
        label: `[${relation.id}] ${relation.type}`,
        cssClass: `${LABEL.cssClass} ${modificationRenderer.getClasses(relation.id).join(' ')}`
      })]
    ]
  })
}
