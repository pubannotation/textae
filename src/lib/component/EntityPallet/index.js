import Pallet from '../Pallet'
import createPalletElement from '../Pallet/createPalletElement'
import createContentHtml from './createContentHtml'
import enableDrag from './enableDrag'
import createAttributeDefinition from '../../createAttributeDefinition'

const config = [
  {
    pred: 'denote',
    'value type': 'selection',
    values: [
      {
        color: '#0000FF',
        label: 'Regulation',
        id: 'http://www.yahoo.co.jp/eeeeeeeeeeeeeeeeeoaoeuaoeuaoue'
      },
      {
        color: '#FF0000',
        id: 'Cell'
      },
      {
        id: 'equivalentTo'
      }
    ]
  },
  {
    pred: 'error',
    'value type': 'flag',
    color: '#FF0000'
  },
  {
    pred: 'warning',
    'value type': 'flag',
    color: '#FFFF00'
  },
  {
    pred: 'score',
    'value type': 'numeric',
    default: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    values: [
      {
        range: 'default',
        color: '#00FF00',
        label: 'Middle'
      },
      {
        range: '[0.8',
        color: '#FF0000',
        label: 'High'
      },
      {
        range: '0.3)',
        color: '#0000FF',
        label: 'Low'
      }
    ]
  },
  {
    pred: 'free_text_predicate',
    'value type': 'string',
    autocompletion_ws: '/dev/autocomplete?order=desc',
    default: 'Down the Rabbit Hole',
    values: [
      {
        pattern: 'default',
        color: '#00FFFF'
      },
      {
        pattern: '^[0-9].*$',
        color: '#FF0000',
        label: 'High'
      }
    ]
  },
  {
    pred: 'reputation',
    'value type': 'selection',
    values: [
      {
        color: '#00FF00',
        id: 'http://dbpedia.org/page/Good'
      },
      {
        color: '#9999FF',
        id: 'http://dbpedia.org/page/Nice'
      }
    ]
  },
  {
    pred: 'Speculation',
    'value type': 'flag',
    color: '#FF8000'
  },
  {
    pred: 'Negation',
    'value type': 'flag',
    color: '#FF3399'
  },
  {
    pred: 'selection with empty values',
    'value type': 'selection',
    values: []
  },
  {
    pred: 'selection with null values',
    'value type': 'selection',
    values: null
  },
  {
    pred: 'selection without values',
    'value type': 'selection'
  }
]

export default class extends Pallet {
  constructor(editor) {
    super(editor, createPalletElement('entity'))

    this._typeContainer = {
      hasAttributeInstance() {
        return false
      },
      hasSelectionAtributeValueInstance() {
        return false
      },
      attributes: config.map((a) => createAttributeDefinition(a))
    }
  }

  updateDisplay() {
    super.updateDisplay()
    enableDrag(this._el, this)
  }

  show() {
    this._selectedPred = null
    super.show()
    enableDrag(this._el, this)
  }

  showAttribute(pred) {
    this._selectedPred = pred
    this.updateDisplay()
  }

  get _content() {
    return createContentHtml(this._typeContainer, this._selectedPred)
  }
}
