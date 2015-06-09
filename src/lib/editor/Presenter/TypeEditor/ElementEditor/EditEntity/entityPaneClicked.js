import selectEntities from './selectEntities';

export default function(selectionModel, e) {
    let typeLabel = e.target.previousElementSibling,
        entities = e.target.children;

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities);
}
