import create from './create';

export default function(editor, typeContainer, gridRenderer, modification, emitter, entity) {
    if (!typeContainer.entity.isBlock(entity.type)) {
        create(editor, typeContainer, gridRenderer, modification, entity);
    }

    emitter.emit('render', entity);

    return entity;
}
