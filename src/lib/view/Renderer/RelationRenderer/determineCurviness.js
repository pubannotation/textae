import DomPositionCache from '../../DomPositionCache';

const CURVINESS_PARAMETERS = {
    // curviness parameters
    xrate: 0.6,
    yrate: 0.05,

    // curviness offset
    c_offset: 20,
};

export default function(editor, annotationData, relation) {
    var domPositionCaChe = new DomPositionCache(editor, annotationData.entity);

    var anchors = toAnchors(relation);
    var sourcePosition = domPositionCaChe.getEntity(anchors.sourceId);
    var targetPosition = domPositionCaChe.getEntity(anchors.targetId);

    var sourceX = sourcePosition.center;
    var targetX = targetPosition.center;

    var sourceY = sourcePosition.top;
    var targetY = targetPosition.top;

    var xdiff = Math.abs(sourceX - targetX);
    var ydiff = Math.abs(sourceY - targetY);
    var curviness = xdiff * CURVINESS_PARAMETERS.xrate + ydiff * CURVINESS_PARAMETERS.yrate + CURVINESS_PARAMETERS.c_offset;
    curviness /= 2.4;

    return curviness;
}

function toAnchors(relation) {
    return {
        sourceId: relation.subj,
        targetId: relation.obj
    };
}
