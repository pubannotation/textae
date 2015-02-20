import domUtil from '../../../util/domUtil';
import idFactory from '../../../util/idFactory';
import uri from '../../../util/uri';
import getDisplayName from './getDisplayName';
import getTypeDom from './getTypeDom';

export default getTypeElement;

function getUri(typeContainer, type) {
    if (uri.isUri(type)) {
        return type;
    } else if (typeContainer.entity.getUri(type)) {
        return typeContainer.entity.getUri(type);
    }
}

// A Type element has an entity_pane elment that has a label and will have entities.
function createEmptyTypeDomElement(typeContainer, spanId, type) {
    var typeId = idFactory.makeTypeId(spanId, type);

    // The EntityPane will have entities.
    var $entityPane = $('<div>')
        .attr('id', 'P-' + typeId)
        .addClass('textae-editor__entity-pane');

    // The label over the span.
    var $typeLabel = $('<div>')
        .addClass('textae-editor__type-label')
        .css({
            'background-color': typeContainer.entity.getColor(type),
        });

    // Set the name of the label with uri of the type.
    var uri = getUri(typeContainer, type);
    if (uri) {
        $typeLabel.append(
            $('<a target="_blank"/>')
            .attr('href', uri)
            .text(getDisplayName(type))
        );
    } else {
        $typeLabel.text(getDisplayName(type));
    }

    return $('<div>')
        .attr('id', typeId)
        .addClass('textae-editor__type')
        .append($typeLabel)
        .append($entityPane); // Set pane after label because pane is over label.
}

function getGrid(gridRenderer, spanId) {
    // Create a grid unless it exists.
    var $grid = domUtil.selector.grid.get(spanId);
    if ($grid.length === 0) {
        return gridRenderer.render(spanId);
    } else {
        return $grid;
    }
}

//render type unless exists.
function getTypeElement(typeContainer, gridRenderer, spanId, type) {
    var $type = getTypeDom(spanId, type);
    if ($type.length === 0) {
        $type = createEmptyTypeDomElement(typeContainer, spanId, type);
        getGrid(gridRenderer, spanId).append($type);
    }

    return $type;
}
