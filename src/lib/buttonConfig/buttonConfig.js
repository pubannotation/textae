export const buttonConfig = [
  {
    list: [
      {
        type: 'read',
        title: 'Import [I]'
      },
      {
        type: 'write',
        title: 'Upload [U]'
      },
      {
        type: 'write-auto',
        title: 'Upload Automatically',
        push: true
      }
    ]
  },
  {
    list: [
      {
        type: 'view',
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
    list: [
      {
        type: 'replicate',
        title: 'Replicate span annotation [R]',
        enableWhenSelecting: {
          span: (selectionModel) =>
            selectionModel.span.single &&
            selectionModel.span.single.isDenotation
        }
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
    usage: 'touch device',
    list: [
      { type: 'create-span', title: 'Create span' },
      { type: 'expand-span', title: 'Expand span' }
    ]
  },
  {
    list: [
      {
        type: 'entity',
        title: 'New entity [E]',
        enableWhenSelecting: {
          span: (selectionModel) =>
            selectionModel.span.contains((s) => s.isDenotation)
        }
      },
      {
        type: 'pallet',
        title: 'Show label list editor [Q]'
      },
      {
        type: 'change-label',
        title: 'Change label [W]',
        enableWhenSelecting: {
          entity: (selectionModel) => selectionModel.entity.some,
          relation: (selectionModel) => selectionModel.relation.some
        }
      }
    ]
  },
  {
    list: [
      {
        type: 'delete',
        title: 'Delete [D]',
        enableWhenSelecting: {
          span: (selectionModel) => selectionModel.span.some,
          entity: (selectionModel) => selectionModel.entity.some,
          relation: (selectionModel) => selectionModel.relation.some
        }
      },
      {
        type: 'copy',
        title: 'Copy [C]',
        enableWhenSelecting: {
          span: (selectionModel) =>
            selectionModel.span.contains((s) => s.isDenotation),
          entity: (selectionModel) =>
            selectionModel.entity.contains((e) => e.isDenotation)
        }
      },
      {
        type: 'cut',
        title: 'Cut [X]',
        enableWhenSelecting: {
          span: (selectionModel) =>
            selectionModel.span.contains((s) => s.isDenotation),
          entity: (selectionModel) =>
            selectionModel.entity.contains((e) => e.isDenotation)
        }
      },
      {
        type: 'paste',
        title: 'Paste [V]',
        enableWhenSelecting: {
          span: (selectionModel, clipBoard) =>
            (clipBoard.hasCopyingItem && selectionModel.span.some) ||
            (clipBoard.hasCuttingItem && Boolean(selectionModel.span.single))
        }
      }
    ]
  },
  {
    usage: 'control bar',
    list: [
      {
        type: 'setting',
        title: 'Setting'
      }
    ]
  },
  {
    usage: 'control bar',
    list: [
      {
        type: 'help',
        title: 'Help [H]'
      }
    ]
  }
]
