import domUtil from '../domUtil';
import DomPositionCache from '../DomPositionCache';
import selectionClass from './selectionClass';
import selectRelation from './selectRelation';
import deselectRelation from './deselectRelation';

export default function(editor, model) {
  let domPositionCache = new DomPositionCache(editor, model.annotationData.entity);

  return {
    span: {
      select: (id) => {
        modifyStyle(editor, 'span', 'add', id)
        focus(editor, 'span', id)
      },
      deselect: (id) => {
        modifyStyle(editor, 'span', 'remove', id)
        blur(editor, 'span', id)
      }
    },
    entity: {
      select: (id) => {
        modifyStyle(editor, 'entity', 'add', id)
        focus(editor, 'entity', id)
      },
      deselect: (id) => {
        modifyStyle(editor, 'entity', 'remove', id)
        blur(editor, 'entity', id)
      }
    },
    relation: {
      select: (id) => selectRelation(domPositionCache, id),
      deselect: (id) => deselectRelation(domPositionCache, id)
    },
    entityLabel: {
      update: (id) => updateEntityLabel(editor, id)
    }
  };
}

function focus(editor, type, id) {
  domUtil.selector[type].get(id, editor).focus()
}

function blur(editor, type, id) {
  let dom = domUtil.selector[type].get(id, editor)

  // A dom does not exist when it is deleted.
  if (dom) {
    dom.blur()
  }
}

function modifyStyle(editor, type, handle, id) {
  var $elment = domUtil.selector[type].get(id, editor);
  selectionClass[handle + 'Class']($elment);
}

// Select the typeLabel if all entities is selected.
function updateEntityLabel(editor, entityId) {
  var $entity = domUtil.selector.entity.get(entityId, editor),
    $typePane = $entity.parent(),
    $typeLabel = $typePane.prev();

  if ($typePane.children().length === $typePane.find('.ui-selected').length) {
    selectionClass.addClass($typeLabel);
  } else {
    selectionClass.removeClass($typeLabel);
  }
}
