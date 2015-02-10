import DomPositionCache from './DomPositionCache';

export default function(editor, entity) {
    var domPositionCaChe = new DomPositionCache(editor, entity),
        processAccosiatedRelation = function(func, entityId) {
            entity.assosicatedRelations(entityId)
                .map(domPositionCaChe.toConnect)
                .filter(function(connect) {
                    return connect.pointup && connect.pointdown;
                })
                .forEach(func);
        };

    return {
        on: _.partial(processAccosiatedRelation, function(connect) {
            connect.pointup();
        }),
        off: _.partial(processAccosiatedRelation, function(connect) {
            connect.pointdown();
        })
    };
}
