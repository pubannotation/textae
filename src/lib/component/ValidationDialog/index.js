import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'

export default class extends Dialog {
  constructor(rejects) {
    const contentHtml = createContentHtml(rejects)

    super('The following erroneous annotations ignored', contentHtml, null, {
      height: 600,
      width: 900
    })
  }
}
