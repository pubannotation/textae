export default function(annotationData, modelType, modification, renderer) {
    var target = annotationData[modelType].get(modification.obj);

    if (target) {
        renderer.changeModification(target);
        buttonStateHelper['updateBy' + capitalize(modelType)]();
    }
}
