export const definition = [
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'import',
        title: 'Import [I]'
      },
      {
        type: 'upload',
        title: 'Upload [U]'
      },
      {
        type: 'upload automatically',
        title: 'Upload Automatically',
        push: true
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'view mode',
        title: 'View Mode',
        push: true
      },
      {
        type: 'term',
        title: 'Term Edit Mode',
        push: true
      },
      {
        type: 'block',
        title: 'Block Edit Mode',
        push: true
      },
      {
        type: 'relation',
        title: 'Relation Edit Mode',
        push: true
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'simple',
        title: 'Simple View',
        push: true
      },
      {
        type: 'line-height',
        title: 'Adjust LineHeight'
      },
      {
        type: 'line-height-auto',
        title: 'Auto Adjust LineHeight',
        push: true
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'undo',
        title: 'Undo [Z]'
      },
      {
        type: 'redo',
        title: 'Redo [A]'
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'replicate',
        title: 'Replicate span annotation [R]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.span.single && selectionModel.span.single.isDenotation
      },
      {
        type: 'replicate-auto',
        title: 'Auto replicate',
        push: true
      },
      {
        type: 'boundary-detection',
        title: 'Boundary Detection [B]',
        push: true
      }
    ]
  },
  {
    usage: {
      'keyboard device': [],
      'touce device': ['control bar', 'context menu']
    },
    list: [
      { type: 'create-span-by-touch', title: 'Create span' },
      { type: 'expand-span-by-touch', title: 'Expand span' },
      { type: 'shrink-span-by-touch', title: 'Shrink span' }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar', 'context menu'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'create-entity',
        title: 'New entity [E]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.span.contains((s) => s.isDenotation)
      },
      {
        type: 'pallet'
      },
      {
        type: 'edit-properties',
        title: 'Edit Properties [W]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.entity.some || selectionModel.relation.some
      },
      {
        type: 'delete',
        title: 'Delete [D]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.span.some ||
          selectionModel.entity.some ||
          selectionModel.relation.some
      }
    ]
  },
  {
    usage: {
      'keyboard device': [],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'copy',
        title: 'Copy [C]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.span.contains((s) => s.isDenotation) ||
          selectionModel.entity.contains((e) => e.isDenotation)
      },
      {
        type: 'cut',
        title: 'Cut [X]',
        enableWhenSelecting: (selectionModel) =>
          selectionModel.span.contains((s) => s.isDenotation) ||
          selectionModel.entity.contains((e) => e.isDenotation)
      },
      {
        type: 'paste',
        title: 'Paste [V]',
        enableWhenSelecting: (selectionModel, clipBoard) =>
          (clipBoard.hasCopyingItem && selectionModel.span.some) ||
          (clipBoard.hasCuttingItem && Boolean(selectionModel.span.single))
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar'],
      'touce device': ['control bar']
    },
    list: [
      {
        type: 'setting',
        title: 'Setting'
      }
    ]
  },
  {
    usage: {
      'keyboard device': ['control bar'],
      'touce device': []
    },
    list: [
      {
        type: 'help',
        title: 'Help [H]'
      }
    ]
  }
]
