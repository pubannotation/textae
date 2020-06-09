export const buttonConfig = [
  [
    {
      type: 'read',
      title: 'Import [I]'
    },
    {
      type: 'write',
      title: 'Upload [U]'
    }
  ],
  [
    {
      type: 'view',
      title: 'View Mode'
    },
    {
      type: 'term',
      title: 'Term Edit Mode'
    },
    {
      type: 'relation',
      title: 'Relation Edit Mode'
    }
  ],
  [
    {
      type: 'simple',
      title: 'Simple View'
    },
    {
      type: 'line-height',
      title: 'Adjust LineHeight'
    }
  ],
  [
    {
      type: 'undo',
      title: 'Undo [Z]'
    },
    {
      type: 'redo',
      title: 'Redo [A]'
    }
  ],
  [
    {
      type: 'replicate',
      title: 'Replicate span annotation [R]',
      enableWhenSelecting: {
        span: (selectionModel) => Boolean(selectionModel.span.single())
      }
    },
    {
      type: 'replicate-auto',
      title: 'Auto replicate'
    },
    {
      type: 'boundary-detection',
      title: 'Boundary Detection [B]'
    }
  ],
  [
    {
      type: 'entity',
      title: 'New entity [E]',
      enableWhenSelecting: {
        span: (selectionModel) => selectionModel.span.some
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
  ],
  [
    {
      type: 'negation',
      title: 'Negation [X]',
      enableWhenSelecting: {
        entity: (selectionModel) => selectionModel.entity.some,
        relation: (selectionModel) => selectionModel.relation.some
      }
    },
    {
      type: 'speculation',
      title: 'Speculation [S]',
      enableWhenSelecting: {
        entity: (selectionModel) => selectionModel.entity.some,
        relation: (selectionModel) => selectionModel.relation.some
      }
    }
  ],
  [
    {
      type: 'delete',
      title: 'Delete [D]',
      enableWhenSelecting: {
        span: (selectionModel) => selectionModel.some,
        entity: (selectionModel) => selectionModel.some,
        relation: (selectionModel) => selectionModel.some
      }
    },
    {
      type: 'copy',
      title: 'Copy [C]',
      enableWhenSelecting: {
        span: (selectionModel) => selectionModel.span.some,
        entity: (selectionModel) => selectionModel.entity.some
      }
    },
    {
      type: 'paste',
      title: 'Paste [V]',
      enableWhenSelecting: {
        span: (selectionModel, clipBoard) =>
          clipBoard.clipBoard.length > 0 && selectionModel.span.some
      }
    }
  ],
  [
    {
      type: 'setting',
      title: 'Setting'
    }
  ],
  [
    {
      type: 'help',
      title: 'Help [H]'
    }
  ]
]
