export default function(editMode) {
    return {
        toTermMode: editMode.pushTerm,
        toRelationMode: editMode.pushRelation,
        toSimpleMode: editMode.pushSimple
    };
}
