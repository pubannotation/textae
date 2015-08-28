import idFactory from '../../../idFactory';
import getTypeElement from './getTypeElement';

export default function createEntityElement(editor, typeContainer, modification, entity) {
    let $entity = $('<div>')
        .attr('id', idFactory.makeEntityDomId(editor, entity.id))
        .attr('title', entity.id)
        .attr('type', entity.type)
        .addClass('textae-editor__entity')
        .css({
            'border-color': typeContainer.entity.getColor(entity.type)
        });

    $entity[0].setAttribute('tabindex', 0)

    // Set css classes for modifications.
    $entity.addClass(modification.getClasses(entity.id));

    return $entity;
}
