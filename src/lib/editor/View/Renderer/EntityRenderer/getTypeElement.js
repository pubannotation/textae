import domUtil from '../../domUtil';
import idFactory from '../../../../util/idFactory';
import uri from '../../../../util/uri';
import getDisplayName from './getDisplayName';
import getTypeDom from './getTypeDom';

//render type unless exists.
export default function(namespace, typeContainer, gridRenderer, spanId, type) {
    let $type = getTypeDom(spanId, type);
    if ($type.length === 0) {
        $type = createEmptyTypeDomElement(namespace, typeContainer, spanId, type);
        getGrid(gridRenderer, spanId).append($type);
    }

    return $type;
}

function getMatchPrefix(namespace, type) {
    let namespaces = namespace.all(),
        matchs = namespaces
        .filter(namespace => namespace.prefix !== '_base')
        .filter(namespace => {
            return type.indexOf(namespace.prefix + ':') === 0;
        });

    if (matchs.length === 1)
        return matchs[0];

    return null;
}

function getUri(namespace, typeContainer, type) {
    if (uri.isUri(type)) {
        return type;
    } else if (typeContainer.entity.getUri(type)) {
        return typeContainer.entity.getUri(type);
    } else if (namespace.some()) {
        let match = getMatchPrefix(namespace, type);
        if (match) {
            return match.uri + type.replace(match.prefix + ':', '');
        }

        let base = namespace.all().filter(namespace => namespace.prefix === '_base');
        if (base.length === 1) {
            return base[0].uri + type;
        }
    }

    return null;
}

function setLabelName(typeLabel, namespace, typeContainer, type) {
    let displayName,
        match = getMatchPrefix(namespace, type);

    if (uri.isUri(type)) {
        displayName = getDisplayName(type);
    } else if (match) {
        displayName = type.replace(match.prefix + ':', '');
    } else {
        displayName = type;
    }

    let child,
        href = getUri(namespace, typeContainer, type);

    if (href) {
        child = `<a target="_blank"/ href="${href}">${displayName}</a>`;
    } else {
        child = displayName;
    }

    typeLabel.innerHTML = child;
}

// A Type element has an entity_pane elment that has a label and will have entities.
function createEmptyTypeDomElement(namespace, typeContainer, spanId, type) {
    let typeId = idFactory.makeTypeId(spanId, type);

    // The EntityPane will have entities.
    let $entityPane = $('<div>')
        .attr('id', 'P-' + typeId)
        .addClass('textae-editor__entity-pane');

    // The label over the span.
    let $typeLabel = $('<div>')
        .addClass('textae-editor__type-label')
        .css({
            'background-color': typeContainer.entity.getColor(type),
        });

    setLabelName($typeLabel[0], namespace, typeContainer, type);

    return $('<div>')
        .attr('id', typeId)
        .addClass('textae-editor__type')
        .append($typeLabel)
        .append($entityPane); // Set pane after label because pane is over label.
}

function getGrid(gridRenderer, spanId) {
    // Create a grid unless it exists.
    let $grid = domUtil.selector.grid.get(spanId);
    if ($grid.length === 0) {
        return gridRenderer.render(spanId);
    } else {
        return $grid;
    }
}
