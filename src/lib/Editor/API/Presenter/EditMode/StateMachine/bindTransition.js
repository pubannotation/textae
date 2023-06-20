import { MODE } from '../../../../../MODE'
import toEnterEvent from './toEnterEvent'

/**
 *
 * @param {import('../Transition').default} transition
 */
export default function (stateMachine, transition) {
  stateMachine
    .on(toEnterEvent(MODE.EDIT_DENOTATION_WITHOUT_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toEditDenotationWithRelation()
      } else {
        transition.toEditDenotationWithoutRelation()
      }
    })
    .on(toEnterEvent(MODE.EDIT_DENOTATION_WITH_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toEditDenotationWithRelation()
      } else {
        transition.toEditDenotationWithoutRelation()
      }
    })
    .on(toEnterEvent(MODE.EDIT_BLOCK_WITHOUT_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toEditBlockWithRelation()
      } else {
        transition.toEditBlockWithoutRelation()
      }
    })
    .on(toEnterEvent(MODE.EDIT_BLOCK_WITH_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toEditBlockWithRelation()
      } else {
        transition.toEditBlockWithoutRelation()
      }
    })
    .on(toEnterEvent(MODE.EDIT_RELATION), () => transition.toEditRelation())
    .on(toEnterEvent(MODE.VIEW_WITHOUT_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toViewWithRelation()
      } else {
        transition.toViewWithoutRelation()
      }
    })
    .on(toEnterEvent(MODE.VIEW_WITH_RELATION), ({ args }) => {
      const withRelation = args[0]

      if (withRelation) {
        transition.toViewWithRelation()
      } else {
        transition.toViewWithoutRelation()
      }
    })
}
