import Promise from 'bluebird';
import Connect from './Connect';
import determineCurviness from './determineCurviness';
import jsPlumbArrowOverlayUtil from './jsPlumbArrowOverlayUtil';

export default function(editor, model, jsPlumbInstance) {
    return new Promise(function(resolve, reject) {
        _.defer(function() {
            try {
                // For tuning
                // var startTime = new Date();

                // Extract relations removed, because relation dom is not synchro with the model.
                let relations = model.annotationData.relation.all().filter(r => !r.removed);

                resetAllCurviness(
                    editor,
                    model.annotationData,
                    relations
                );
                jsPlumbInstance.repaintEverything();
                reselectAll(
                    editor,
                    model.annotationData,
                    model.selectionModel.relation.all()
                );

                // For tuning
                // var endTime = new Date();
                // console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

function reselectAll(editor, annotationData, relationIds) {
    relationIds.map(relationId => new Connect(editor, annotationData, relationId))
        .filter(connect => connect instanceof jsPlumb.Connection)
        .forEach(connect => connect.select());
}

function resetAllCurviness(editor, annotationData, relations) {
    relations.map(relation => {
            return {
                connect: new Connect(editor, annotationData, relation.id),
                curviness: determineCurviness(editor, annotationData, relation)
            };
        })
        // Set changed values only.
        .filter(data => data.connect.setConnector &&
            data.connect.connector.getCurviness() !== data.curviness
        )
        .forEach(data => {
            data.connect.setConnector(['Bezier', {
                curviness: data.curviness
            }]);

            // Re-set arrow because it is disappered when setConnector is called.
            jsPlumbArrowOverlayUtil.resetArrows(data.connect);
        });
}
