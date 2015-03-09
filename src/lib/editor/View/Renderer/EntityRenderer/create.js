import idFactory from '../../../../util/idFactory';
import getTypeElement from './getTypeElement';
import arrangePositionOfPane from './arrangePositionOfPane';

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function(editor, namspace, typeContainer, gridRenderer, modification, entity) {
    // Replace null to 'null' if type is null and undefined too.
    entity.type = String(entity.type);

    // Append a new entity to the type
    let $pane = getTypeElement(
            namspace,
            typeContainer,
            gridRenderer,
            entity.span,
            entity.type
        )
        .find('.textae-editor__entity-pane'),
        entityDomId = idFactory.makeEntityDomId(editor, entity.id);

    if ($pane.find('#' + entityDomId).length === 0) {
        $pane.append(createEntityElement(editor, typeContainer, modification, entity));
        arrangePositionOfPane($pane);
    }
}

function createEntityElement(editor, typeContainer, modification, entity) {
    let $entity = $('<div>')
        .attr('id', idFactory.makeEntityDomId(editor, entity.id))
        .attr('title', entity.id)
        .attr('type', entity.type)
        .addClass('textae-editor__entity')
        .css({
            'border-color': typeContainer.entity.getColor(entity.type)
        });

    // Set css classes for modifications.
    $entity.addClass(modification.getClasses(entity.id));

    return $entity;
}
