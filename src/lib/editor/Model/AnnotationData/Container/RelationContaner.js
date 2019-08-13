import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'relation', (relations) =>
      relations.map((r) => ({
        id: r.id,
        type: r.pred,
        subj: r.subj,
        obj: r.obj
      }))
    )
  }
}
